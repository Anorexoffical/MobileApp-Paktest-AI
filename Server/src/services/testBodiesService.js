import prisma from "../config/prisma.js";

const formatTestBody = (testBody) => ({
  id: testBody.testBodyID,
  testBodyID: testBody.testBodyID,
  name: testBody.shortName,
  shortName: testBody.shortName,
  fullName: testBody.fullName,
  description: testBody.description ?? "",
  icon: "🏛️",
  positionsCount: testBody.positions?.length ?? 0,
});

const sanitizeBodyPayload = (data = {}) => {
  const shortName = typeof data.shortName === "string" ? data.shortName.trim() : "";
  const fullName = typeof data.fullName === "string" ? data.fullName.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : null;

  if (!shortName || !fullName) {
    throw new Error("VALIDATION_ERROR");
  }

  return {
    shortName,
    fullName,
    description: description || null,
  };
};

const ensureValidId = (id) => {
  const numericId = Number.parseInt(id, 10);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("INVALID_ID");
  }

  return numericId;
};

const ensureUniqueShortName = async (shortName, idToIgnore = null) => {
  const normalizedShortName = shortName.toLowerCase();
  const existing = await prisma.testConductBody.findMany({
    select: {
      testBodyID: true,
      shortName: true,
    },
  });

  const duplicate = existing.some((candidate) => {
    if (candidate.testBodyID === idToIgnore) {
      return false;
    }

    return typeof candidate.shortName === "string" && candidate.shortName.toLowerCase() === normalizedShortName;
  });

  if (duplicate) {
    throw new Error("DUPLICATE_SHORT_NAME");
  }
};

export const testBodiesService = {
  getAllTestBodies: async () => {
    const testBodies = await prisma.testConductBody.findMany({
      orderBy: {
        testBodyID: "asc",
      },
      include: {
        positions: {
          select: {
            positionID: true,
          },
        },
      },
    });

    return testBodies.map(formatTestBody);
  },

  getTestBodyById: async (id) => {
    const numericId = ensureValidId(id);

    const testBody = await prisma.testConductBody.findUnique({
      where: { testBodyID: numericId },
      include: {
        positions: {
          select: {
            positionID: true,
          },
        },
      },
    });

    if (!testBody) {
      throw new Error("TEST_BODY_NOT_FOUND");
    }

    return formatTestBody(testBody);
  },

  createTestBody: async (data) => {
    const payload = sanitizeBodyPayload(data);
    await ensureUniqueShortName(payload.shortName);

    const created = await prisma.testConductBody.create({
      data: payload,
      include: {
        positions: {
          select: {
            positionID: true,
          },
        },
      },
    });

    return formatTestBody(created);
  },

  updateTestBody: async (id, data) => {
    const numericId = ensureValidId(id);
    const payload = sanitizeBodyPayload(data);

    const existing = await prisma.testConductBody.findUnique({
      where: { testBodyID: numericId },
    });

    if (!existing) {
      throw new Error("TEST_BODY_NOT_FOUND");
    }

    await ensureUniqueShortName(payload.shortName, numericId);

    const updated = await prisma.testConductBody.update({
      where: { testBodyID: numericId },
      data: payload,
      include: {
        positions: {
          select: {
            positionID: true,
          },
        },
      },
    });

    return formatTestBody(updated);
  },

  deleteTestBody: async (id) => {
    const numericId = ensureValidId(id);

    const existing = await prisma.testConductBody.findUnique({
      where: { testBodyID: numericId },
    });

    if (!existing) {
      throw new Error("TEST_BODY_NOT_FOUND");
    }

    const deleted = await prisma.testConductBody.delete({
      where: { testBodyID: numericId },
      include: {
        positions: {
          select: {
            positionID: true,
          },
        },
      },
    });

    return formatTestBody(deleted);
  },
};
