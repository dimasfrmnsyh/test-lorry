const dbConf = {
	production: 'mongodb+srv://dimasfrmnsyh:wCQpXao7Hw53VGgC@cluster0.r0qyxdg.mongodb.net/test',
	local: 'mongodb://localhost:27017/local',
    
}
const ENV = process.env.NODE_ENV || 'production'
const db = dbConf[ENV]
const secret = '123'

const conf = {
	db,
	secret,
}

module.exports = conf