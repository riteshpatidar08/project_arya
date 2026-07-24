const checkRole = (roles) => {
    return (req,res,next) => {
        console.log(req.user.role)
        if(roles.includes(req.user.role)){
            next()
        }else {
            return res.status(403).json({
                success : false ,
                message : `You are a ${req.user.role} , you are not  authorize to access this resource`
            })
        }

    }
}

module.exports = checkRole