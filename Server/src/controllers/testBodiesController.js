import { testBodiesService } from "../services/testBodiesService.js";

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const getAllTestBodies = async (req, res) => {
  try {
    const data = await testBodiesService.getAllTestBodies();

    return res.status(200).json({
      success: true,
      message: "Test bodies fetched successfully",
      data,
    });
  } catch (error) {
    return sendError(res, 500, error.message || "Failed to fetch test bodies");
  }
};

export const getTestBodyById = async (req, res) => {
  try {
    const data = await testBodiesService.getTestBodyById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Test body fetched successfully",
      data,
    });
  } catch (error) {
    if (error.message === "INVALID_ID") {
      return sendError(res, 400, "Invalid test body id");
    }

    if (error.message === "TEST_BODY_NOT_FOUND") {
      return sendError(res, 404, "Test body not found");
    }

    return sendError(res, 500, error.message || "Failed to fetch test body");
  }
};

export const createTestBody = async (req, res) => {
  try {
    const data = await testBodiesService.createTestBody(req.body);

    return res.status(201).json({
      success: true,
      message: "Test body created successfully",
      data,
    });
  } catch (error) {
    if (error.message === "VALIDATION_ERROR") {
      return sendError(res, 400, "shortName and fullName are required");
    }

    if (error.message === "DUPLICATE_SHORT_NAME") {
      return sendError(res, 409, "Test body shortName already exists");
    }

    return sendError(res, 500, error.message || "Failed to create test body");
  }
};

export const updateTestBody = async (req, res) => {
  try {
    const data = await testBodiesService.updateTestBody(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Test body updated successfully",
      data,
    });
  } catch (error) {
    if (error.message === "INVALID_ID") {
      return sendError(res, 400, "Invalid test body id");
    }

    if (error.message === "VALIDATION_ERROR") {
      return sendError(res, 400, "shortName and fullName are required");
    }

    if (error.message === "TEST_BODY_NOT_FOUND") {
      return sendError(res, 404, "Test body not found");
    }

    if (error.message === "DUPLICATE_SHORT_NAME") {
      return sendError(res, 409, "Test body shortName already exists");
    }

    return sendError(res, 500, error.message || "Failed to update test body");
  }
};

export const deleteTestBody = async (req, res) => {
  try {
    const data = await testBodiesService.deleteTestBody(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Test body deleted successfully",
      data,
    });
  } catch (error) {
    if (error.message === "INVALID_ID") {
      return sendError(res, 400, "Invalid test body id");
    }

    if (error.message === "TEST_BODY_NOT_FOUND") {
      return sendError(res, 404, "Test body not found");
    }

    return sendError(res, 500, error.message || "Failed to delete test body");
  }
};
