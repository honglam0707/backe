const mongoose = require('mongoose')
const {KhSchema} = require('./kh_m')
const uSchema = new mongoose.Schema({
	fullName:{type:String, require:true},
	email:{type:String, require:true},
	password:{type:String, require:true},
	phone:{type:Number, require:true},
	userType:{type:String,require:true},
	birthOfDate:{type:Date},
	sex:{type:String},
	kh_list:[{
		// name:{type:String},
		// timeStart:{type:Date},
		// timeStop:{type:Date},
		// gv:{type:String},
		_id:{type:mongoose.Schema.Types.ObjectId,
			  ref:'KH'
		}
	}]
})

const User = mongoose.model('User',uSchema)

module.exports={User,uSchema}