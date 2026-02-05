const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A user should have a name']
    },
    password:{
        type:String,
        required:[true,'A user should have a password'],
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            // This only works on .CREATE and .SAVE!!!
            validator:function(value){
                return this.password===value
            },
            message:'Passwords are not the same'
        }
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:[true,'There is already a user with this email'],
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
        },
        address:{
           type: String,
           required:[true,'Where we should deliver?']
        },
        phoneNumber:{
            type:String,
            required:[true,'A phone number is required for delivery!'],
            trim:true,
            validate:{
                validator:function(val){
                    return validator.isMobilePhone(val,'any')
                },
                message:'Please provide a valid phone number.'
            }
        }
    }
)

//midleware for password:
userSchema.pre('save',async function() {
    // Only run this if password was actually modified
    if (!this.isModified('password')) return ;

this.password= await bcrypt.hash(this.password,10);

    // Delete confirmPassword field
    this.confirmPassword = undefined;
    return;
});
//midleware for phoneNumber
userSchema.pre('save',function(){
    if (!this.isModified('phoneNumber')) return ;
// 2) Replace all non-digit characters with an empty string
    // \D matches any character that is NOT a digit
    this.phoneNumber = this.phoneNumber.replace(/\D/g, '');
return;
})

//method:
userSchema.methods.comparePassword=async function (candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

const User=mongoose.model('User',userSchema);

module.exports=User;
