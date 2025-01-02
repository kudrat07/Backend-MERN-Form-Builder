const Bubble = require("../models/bubbles")


// CREATING A BUBBLE
exports.createBubble = async(req, res) => {

    try{
        const {formId} = req.params;
        const {bubbles} = req.body;
        console.log(formId, bubbles);
        const newBubble = await Bubble.create({formId, bubbles})
        res.status(201).json({
            success:true,
            message:"Bubbles saved successfully!",
            newBubble
        })
    } catch(error){
        console.log(error)
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })
    }

}  

// ACCESSING BUBBLES

exports.getBubble = async(req, res) => {
    const {formId} = req.params;
    try {
        if(!formId) {
            return res.status(400).json({
                success:false,
                message:"User id is required"
            })
        }

        const bubble = await Bubble.find({formId})
        if(bubble.length === 0) {
          return  res.status(200).json({
                data:[]
            })
        }

       return res.status(200).json(bubble)
    
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message:"Something went wrong",
            error: error.message
        })
        
    }
}

