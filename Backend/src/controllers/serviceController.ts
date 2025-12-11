import { Request, Response } from "express";
import { getAllServices, getServiceByName,createService,updateService,deleteService } from "../services/serviceService";
import Service from "../models/Service";

export async function getServices(req: Request, res: Response) {
  const services = await getAllServices();
  return res.status(200).json(services);
}

export async function getService(req: Request, res: Response) {
  const { name } = req.params;

  const service = await getServiceByName(name!);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  return res.status(200).json(service);
}

export async function createServiceController(req: Request, res: Response) {
  try {
    const service = await createService(req.body);
    return res.status(201).json(service);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function updateServiceController(req: Request, res: Response){
  
    const { name } = req.params; 
  
    const updated = await updateService(name!, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.json(updated);
}

export async function deleteServiceController(req: Request, res: Response) {
  try {
    const { name } = req.params;
    //@ts-ignore
    const deleted = await Service.findOneAndDelete({ name });

    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Delete service error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}