const mongoose=require('mongoose');

const chatSchema= mongoose.Schema({
    chatName:{type:String,trim:true},
    isGroupChat:{type:Boolean,default:false},
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index: true,
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
},{
    timestamps:true,
});

chatSchema.index({ users: 1, updatedAt: -1 });

const Chat= mongoose.model("Chat",chatSchema);
module.exports=Chat;
