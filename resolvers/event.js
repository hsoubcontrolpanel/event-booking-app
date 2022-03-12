const Event = require('../models/event')
const { transformEvent } = require('./transform')
const { UserInputError } = require('apollo-server-express')
const { combineResolvers } = require("graphql-resolvers")
const { isLoggedIn } = require("../middlewares/isLogin")

const eventResolver = {
    Query: {
        events: async () => {
            try {
                const events = await Event.find({}).populate('creator')
                return events.map( event => transformEvent(event))
            } catch (err) {
                throw err
            }
        },
        getUserEvents: async (_, { userId }) => {
            try {
                const events = await Event.find({ creator: userId }).populate('creator')
                return events.map( event => transformEvent(event))
            } catch (err) {
                throw err
            }
        }
    },
    Mutation: {
        createEvent: combineResolvers(isLoggedIn, async (_, args, context) => {
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
                return transformEvent(event)
            } catch (err) {
                throw err
            }
        }),
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
module.exports = { eventResolver }