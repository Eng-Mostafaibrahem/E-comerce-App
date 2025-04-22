import { Adresses } from "../../../DB/Models/index.js";
import { ErrorHandleClass } from "../../Utils/error-Class.utils.js";

// API{post} add address
/***
 * @param {req}
 * @param {res}
 * @param {next}
 * @param {return} mesage,adddress data
 */

export const addAddress = async (req, res, next) => {
  //destruct data from req.body
  const {
    country,
    city,
    floorNumber,
    buildingNumber,
    postalCode,
    addressLabel,
    setAsDefault,
  } = req.body;
  const userId = req.authUser._id;

  const newAddress = new Adresses({
    country,
    city,
    floorNumber,
    buildingNumber,
    userId,
    postalCode,
    addressLabel,
    isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false,
  });

  if (newAddress.isDefault) {
    await Adresses.updateOne({ userId, isDefault: true }, { isDefault: false });
  }

  const address = await newAddress.save();
  res.status(201).json({ message: "Address added successfully", address });
};

/**
 * API {Put} api gosls update address
 * @param {req}
 * @param {res}
 * @param {next}
 * @return {mesage , updated address}
 *
 */

export const updateAddress = async (req, res, next) => {
  //destruct data
  const {
    country,
    city,
    floorNumber,
    buildingNumber,
    postalCode,
    addressLabel,
    setAsDefault,
  } = req.body;
  const { addressId } = req.params;
  const userId = req.authUser._id;

  const address = await Adresses.findOne({
    _id: addressId,
    userId,
    isMarkedAsDelete: false,
  });
  if (!address)
    return next(
      new ErrorHandleClass("address not found", 404, "address not found")
    );

  if (country) address.country = country;
  if (city) address.city = city;
  if (floorNumber) address.floorNumber = floorNumber;
  if (buildingNumber) address.buildingNumber = buildingNumber;
  if (postalCode) address.postalCode = postalCode;
  if (addressLabel) address.addressLabel = addressLabel;
  if ([true, false].includes(setAsDefault)) {
    (address.isDefault = [true, false].includes(setAsDefault)
      ? setAsDefault
      : false),
      await Adresses.updateOne(
        { userId, isDefault: true },
        { isDefault: false }
      );
  }
  await address.save();
  res.status(200).json({ message: "Address updated successfully", address });
};

/**
 * API {Delete} api gosls delete address
 * @param {req}
 * @param {res}
 * @param {next}
 * @return {message}
 * */

export const deleteAddress = async (req, res, next) => {
  const { addressId } = req.params;
  const userId = req.authUser._id;
  //hard delete
  //   const address = await Adresses.findOneAndDelete({_id:addressId});
  //   if(!address) return next(new ErrorHandleClass("Address not found",404,"address not found"))

  //soft delete
  const address = await Adresses.findOneAndUpdate(
    { _id: addressId, userId, isMarkedAsDelete: false },
    { isMarkedAsDelete: true ,isDefault: false},
    { new: true }
  );
  if(!address) return next(new ErrorHandleClass("Address not found",404,"address not found"))

  res.status(200).json({ message: "Address deleted successfully" });
};


export const allAddress= async(req,res,next)=>{
    const userId=req.authUser._id;
    const addresses=await Adresses.find({userId,isMarkedAsDelete:false}).sort({updatedAt: -1});
    if(!addresses) return next(new ErrorHandleClass("address not found",404,"address not found"))
    res.status(200).json({message:"list of address",addresses})
}
