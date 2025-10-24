import { Request, Response } from "express";
import { OverviewService } from "./overview.service";

const getOverview = async (req: Request, res: Response) => {
  try {
    const data = await OverviewService.getOverview();
    res.status(200).json({
      success: true,
      message: "Overview fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Overview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overview",
    });
  }
};

export const OverviewController = { getOverview };
