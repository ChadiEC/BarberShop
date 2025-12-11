import Service from "../models/Service";


export async function getAllServices() {
    return Service.find().sort({name:1});    
}

export async function getServiceByName(name: string) {
  // Normaliser le string d'URL
  const normalized = name.replace(/[-_]/g, " "); 

  return Service.findOne({
    name: new RegExp(`^${normalized}$`, "i")
  });
}
export async function createService(data: {name: string; duration: number; price: number; description?:string; photoUrl?:string; }) {
  return Service.create(data);
}

export async function updateService(name: string ,data: any) {
  return Service.findOneAndUpdate( {name}, data, { new: true });
}

export async function deleteService(name: string) {
  const normalized = name.replace(/[-_]/g, " ");

  return Service.findOneAndDelete({
    name: new RegExp(`^${normalized}$`, "i") // case-insensitive
  });
}