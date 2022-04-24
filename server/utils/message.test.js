const expect = require('expect');

let {generateMessage} = require('./message')

describe('generateMessage', function(){
    it('should generate correct message object',()=>{
        let from = "my gang", text = "Randomtext",
            message = generateMessage(from,text);
    expect(typeof message.createdAt).toBe('number')
    expect(message).toMatchObject({from,text})
    })
})

