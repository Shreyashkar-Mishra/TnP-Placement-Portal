import  {Company} from '../models/company.model.js';
export const registerCompany = async (req, res) => {
  // Registration logic here
  try{
    const{companyName}=req.body;
    if(!companyName){
        return res.status(400).json({message:'Provide Company Name',success:false});
      }
          let company = await Company.findOne({name:companyName});
            if(company){
                return res.status(400).json({message:'Company already exists',success:false});
            }
        company= await Company.create({name:companyName,userId:req.user});
        return res.status(201).json({message:'Company registered successfully',success:true,company});
    }
  catch(error){console.log({message:error.message})}
}


export const getCompanies = async (req, res) => {
  // Logic to get companies here
  try{
    const userId=req.user;
    const companies= await Company.find({userId});
    if(!companies){
        return res.status(404).json({message:'No companies found',success:false});
    }
    return res.status(200).json({message:'Companies fetched successfully',success:true,companies});
  }
  catch(error){console.log({message:error.message})}
}
export const getCompanyById = async (req, res) => {
  // Logic to get a company by ID here
  try{
    const companyId=req.params.id;
    const company= await Company.findById(companyId);
    if(!company){
        return res.status(404).json({message:'Company not found',success:false});
    }
    return res.status(200).json({message:'Company fetched successfully',success:true,company});
  }catch(error){console.log({message:error.message})}
}




export const updateCompany = async (req, res) => {
  // Logic to update company here
  try{
    const{name,description,website}=req.body;
    const file=req.file;
    //idhar cloudinary aayega

    const updateData={name,description,website};
    const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});
    if(!company){
        return res.status(404).json({message:'Company not found',success:false});
    }
    return res.status(200).json({message:'Company updated successfully',success:true,company});
  }
  catch(error){console.log({message:error.message})}
}
