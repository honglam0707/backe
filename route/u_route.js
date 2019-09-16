const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const {secretKey} = require('../config/key')
const {User} = require('../models/u_m')
const {Tcher} = require('../models/t_m')
const {authorizing} = require('../middleware/auth')
const router = express.Router();


router.post('/register',(req,res)=>{
	const {fullName,email,password,phone,sex,birthOfDate,userType} = req.body;
	User.findOne({$or:[{email},{phone}]})
     .then(user=>{
		 if(user)return res.status(401).json({error:'email or phone extits'})
		 const newU = new User({
			 fullName,email,password,phone,birthOfDate,userType,sex
		 })
		 bcrypt.genSalt(10,(err,salt)=>{
			 if(err)return res.status(401).json(err)
			 bcrypt.hash(newU.password,salt,(err,hash)=>{
				if(err)return res.status(401).json(err)
				newU.password = hash
				newU.save()
					 .then(u=>res.status(200).json(u))
					 .catch(console.log)
			 })
		 })
		 
	 })
	 .catch(console.log)
})
router.post('/login',(req,res)=>{
	const {email,password} = req.body;
	User.findOne({email})
		.then(user=>{
			if(!user)return res.status(401).json({error:'email is wrong'})
			bcrypt.compare(password,user.password)
				  .then(isMatch=>{
					  if(!isMatch) return res.status(401).json({error:'password is wrong'})
					  const payload=({
						  id:user._id,
						  fullName:user.fullName,
						  email:user.email,
						  userType:user.userType,
						  sex:user.sex,
						  kh_list:user.kh_list,
						  phone:user.phone
					  })
					  
					  jwt.sign(
						payload,
						secretKey,
						(err,token)=>{
							if(err)return res.status(400).json(err)
							return res.status(200).json({
								success:true,
								token:'Bearer ' + token
							})
						}
					  )
				  })
		})
})

router.post('/tCher/addprofie',
			passport.authenticate('jwt',{session:false}),
			authorizing('GV'),
			(req,res)=>{
				const {skills} = req.body;
				Tcher.findById(req.user.id)
					 .then(tcher=>{
						 if(tcher)return res.status(400).json({Error:'profile exits'})
						 const newTcher = new Tcher({skills,userId:req.user.id})
						 newTcher.save()
								 .then(tcher=>res.status(200).json(tcher))
								 .catch(console.log)
					 })	
			}
	)

router.put('/update-profile',
			passport.authenticate('jwt',{session:false}),
			(req,res)=>{
				const {fullName,password,phone,birthOfDate,sex,skills} = req.body;
				User.findById(req.user.id)
					.then(user=>{
						if(!user) return res.status(401).json({Error:'User does not exits'})
						user.fullName=fullName;
						user.password=password;
						user.birthOfDate=birthOfDate;
						user.phone=phone;
						user.sex=sex;
						if(req.user.userType==='GV')
						user.skills=skills;
						bcrypt.genSalt(10,(err,salt)=>{
							if(err)return res.status(404).json(err)
							bcrypt.hash(user.password,salt,(err,hash)=>{
								if(err)return res.status(404).json(err)
								user.password=hash
								user.save()
								.then(user=>res.status(200).json(user))
								.catch(console.log)
							})
						})
					    
					})
			}
)
router.get('/dsmember',(req,res)=>{
	User.find()
		.then(ds=>{
			res.status(200).json(ds)
		})
		.catch(console.log)
})
module.exports = router;