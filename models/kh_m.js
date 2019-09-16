const mongoose = require('mongoose')

const KhSchema = new mongoose.Schema({
	userId:{type:mongoose.Schema.Types.ObjectId,
			ref:'User',
			require:true
	},
	//khId:{type:mongoose.Schema.Types.ObjectId, require:true},
	name:{type:String, require:true},
	timeStart:{type:Date, require:true},
	timeStop:{type:Date, require:true},
	hv:[{
	    // fullName:{type:String},
		// email:{type:String},
		// userType:{type:String}
		_id:{type:mongoose.Schema.Types.ObjectId,
			ref:'User'
		}
	}],
	gv:{type:String,require:true},
	isTrue:{type:Boolean, default:false},
	isFinish:{type:Boolean, default:false}
})

const KH = mongoose.model('KH',KhSchema)

module.exports={KH,KhSchema}