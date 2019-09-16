function authorizing(userType){
	return(req,res,next)=>{
		if(req.user.userType===userType){
			return next();
		}
		res.status(400).json({error:"No permission"})
	}
}
function authorProfile(userType){
	return(req,res,next)=>{
		if(req.user.userType===userType){
			if(userType==='HV')
			{
				
			}
			return next();
		}
		res.status(400).json({error:"No permission"})
	}
}
module.exports={
	authorizing
}