const User = require('../models/user')
const { UserInputError, AuthenticationError } = require('apollo-server-express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Event = require('../models/event')
const resolvers = {
    Query: {
        events: async () => {
            try {
                const events = await Event.find({}).populate('creator')
                return events.map( event => ({ ...event._doc, date: event.date.toDateString() }))
            } catch (err) {
                throw err
            }
        },
        getUserEvents: async (_, { userId }) => {
            try {
                const events = await Event.find({ creator: userId }).populate('creator')
                return events.map( event => ({ ...event._doc, date: event.date.toDateString() }))
            } catch (err) {
                throw err
            }
        }
    },
    Mutation: {
        createUser: async (_, args) => {
            try {
                const existingUser = await User.findOne({ email: args.userInput.email })
                if(existingUser) {
                    throw new UserInputError('هذا الحساب موجود مسبقًا لدينا!', {
                        invalidArgs: args.userInput.email
                    })
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
                const user = new User({
                    username: args.userInput.username,
                    email: args.userInput.email,
                    password: hashedPassword
                })
                await user.save()
                const userForToken = {
                    email: user.email,
                    id: user.id
                }
                return {
                    userId: user.id,
                    token: jwt.sign(userForToken, process.env.JWT_SECRET),
                    username: user.username
                }
            } catch (err) {
                throw err
            }
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email: email })
            if(!user){
                throw new UserInputError('هذا الحساب غير موجود لدينا')
            }
            const isEqual= await bcrypt.compare(password, user.password)
            if(!isEqual){
                throw new UserInputError('خطأ في البريد الإلكتروني أو كلمة المرور!')
            }
            const userForToken = {
                email: user.email,
                id: user.id
            }
            return {
                userId: user.id,
                token: jwt.sign(userForToken, process.env.JWT_SECRET),
                username: user.username
            }
        },
        createEvent: async (_, args, context) => {
            if(!context.user) {
                throw new AuthenticationError('يجب تسجيل دخولك!')
            }
            const existinEvent = await Event.findOne({ title: args.eventInput.title })
            if(existinEvent){
                throw new UserInputError('يوجد لدينا مناسبة بنفس هذا العنوان، الرجاء اختيار عنوان آخر!')
            }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                date: new Date(args.eventInput.date),
                price: args.eventInput.price,
                creator: context.user._id
            })
            try {
                await event.save()
                return { ...event._doc, date: event.date.toDateString() }
            } catch (err) {
                throw err
            }
        },
        deleteEvent: async (_, args) => {
            try {
                await Event.deleteOne({ _id: args.eventId }).populate('creator')
                return Event.find({})
            } catch (err) {
                throw err
            }
        }
    }
}

module.exports = { resolvers }