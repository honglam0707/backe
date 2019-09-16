const express = require('express')
const passport = require('passport')

const {Tcher} = require('../models/t_m')
const {KH} = require('../models/kh_m')
const {User} = require('../models/u_m')
const {authorizing} = require('../middleware/auth')

const router = express.Router();

router.post('/createkh',
			passport.authenticate('jwt',{session:false}),
			authorizing('GV'),
			(req,res)=>{
				const {name,timeStart,timeStop} = req.body;
				const newDate =  new Date();
				KH.findOne({name:name,timeStart:timeStart})
				  .then(kh=>{
					  if(kh)return res.status(400).json({error:'kh exits'})
					  else if(newDate>timeStart || newDate>timeStop) return res.status(401).json({Error:'timeDate is wrong'})
							
					  const newKh = new KH({
						  name,timeStart,timeStop,userId:req.user.id,gv:req.user.fullName
					  })
					  
					  
					  newKh.save()
						   .then(kh=>{
							   Tcher.findOne({userId:req.user.id})
								    .then(tcher=>{
										if(!tcher) return res.status(400).json('failed')
											//res.status(200).json(tcher)
										 
										 //tcher.khCurrent.push(newKh)
										 tcher.khCurrent.push(newKh._id)
										 tcher.khTotal+=1;
										 tcher.save()
											  .then(tcher=>res.status(200).json(tcher))
											  .catch(console.log)
									})
						   })
				  })
				  .catch(console.log)
			}
)

router.post('/book-kh/:khId',
			passport.authenticate('jwt',{session:false}),
			authorizing('HV'),
			(req,res)=>{
				const hvId = req.user.id;
				const khId = req.params.id;//**//
				KH.findOne({khId})
				  .then(kh=>{
					  if(!kh) return res.status(400).json({error:'wrong'})
						
						
							for(let i=0;i<kh.hv.length;i++)
							{
								// if(kh.hv[i].email===req.user.email)
								// {
								// 	return res.status(400).json({Error:'dadk'})
								// }
								if(kh.hv[i]._id===hvId)
								{
									return res.status(400).json({Error:'dadk'})
								}
							}
							 
							//kh.hv.push(req.user)
							kh.hv.push(req.user._id)
							kh.save()
							  .then(kh=>{
									User.findById(req.user.id)
										.then(user=>{
										 if(!user) return res.status(400).json({Error:'wrong'})
										 //user.kh_sign.push(kh)
										 user.kh_sign.push(khId)
										 user.save()
											 .then(user=>res.status(200).json(user))
											 .catch(console.log)
									})
								})
								.catch(console.log)

				  })
				
			}
)

router.put('/update-kh/:khId',
			passport.authenticate('jwt',{session:false}),
			authorizing('GV'),
			(req,res)=>{
				const {name,timeStart,timeStop,isFinish} = req.body;
				const khId = req.params.id;//**//
				KH.findOne({khId})
				  .then(kh=>{
					  if(!kh)return res.status(404).json({Error:'kh does not exits'})
							// Tcher.findOne({userId:req.user.id})
							// 	 .then(tcher=>{
							// 		 if(!tcher)return res.status(401).json({Error:'tokens error'})
							// 		// res.status(200).json(tcher)
							// 		 for(let i=0;i<tcher.khCurrent.length;i++)
							// 		 {
							// 			 if(tcher.khCurrent[i].name === kh.name && tcher.khCurrent[i].timeStart=== kh.timeStart)
							// 			 {
							// 				 tcher.khCurrent[i].name = name;
							// 				 tcher.khCurrent[i].timeStart = timeStart;
							// 				 tcher.khCurrent[i].timeStop = timeStop;
							// 				 tcher.khCurrent[i].isFinish = isFinish;
							// 				 tcher.save();
											 	 
							// 				 break;
							// 			 }
							// 		  }
							// 	 })
							// 	 .catch(console.log)
							// User.find({userType:'HV'})
							// 	.then(user=>{
							// 		for(let j=0;j<user.length;j++)
							// 		{
							// 			for(let i=0;i<user[j].kh_sign.length;i++)
							// 			{
							// 				if(user[j].kh_sign[i].khId === khId)
							// 				{
							// 					user[j].kh_sign[i].name = name;
							// 					user[j].kh_sign[i].timeStart = timeStart;
							// 					user[j].kh_sign[i].timeStop = timeStop;
							// 					user[j].save()
							// 				}
							// 			}	
							// 		}	
							// 	})
							// 	.catch(console.log)
							kh.name=name
							kh.timeStart=timeStart
							kh.timeStop=timeStop
							kh.isFinish=isFinish
							kh.save()
							  .then(kh=> res.status(200).json(kh))
							  .catch(console.log)

				  })
			}
)

router.get('/listkh',(req,res)=>{
	KH.find()
	  .then(list=>{
		  res.status(200).json(list) 
	  })
	  .catch(console.log)
})

router.get('/tcher/mykh',
			passport.authenticate('jwt',{session:false}),
			authorizing('GV'),
			(req,res)=>{
				KH.find({userId:req.user.id})
				  .then(list=>{
					  res.status(200).json(list);
				  })
				  .catch(console.log)
			}
)
router.get('/hv/mykh',
			passport.authenticate('jwt',{session:false}),
			authorizing('HV'),
			(req,res)=>{
				User.findById(req.user.id)
				  .then(user=>{
					  res.status(200).json(user.kh_sign);
				  })
				  .catch(console.log)
			}
)
router.delete('/mykh/:khId',
			passport.authenticate('jwt',{session:false}),
			authorizing('GV'),
			(req,res)=>{
				const khId = req.params.id
				KH.find({userId:req.user.id})
				  .then(list=>{
					  for(let i=0;i<list.length;i++)
					  {
						  if(list[i].khId===khId)
							  list.splice(i,1);
					  }
				  })
				  .catch(console.log)
			}
)
module.exports=router;