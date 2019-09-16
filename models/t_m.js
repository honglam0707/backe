const mongoose = require('mongoose')
const {KhSchema} = require('./kh_m')
const tSchema = new mongoose.Schema({
	userId:{type:mongoose.Schema.Types.ObjectId,
		ref:'User',
		require:true
	},
	skills:{type:String, require:true},
	//khCurrent:[KhSchema],
// 	khCurrent:[{_id:{type:mongoose.Schema.Types.ObjectId,
// 		ref:'KH'
// 	}
// }],
// 	khTotal:{type:Number, default:0}
})

const Tcher = mongoose.model('Tcher',tSchema)
module.exports={Tcher,tSchema}