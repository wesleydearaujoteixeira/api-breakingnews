
function Create (req, res) {

    const {name, username, email, password, avatar, background} = req.body;

    // Validation
    if(!name || !username || !email || !password, !avatar, !background) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const user = {
        name, 
        username,
        email,
        password,
        avatar,
        background,
    }

    res.status(201).json(
        {
            message: 'Created successfull',
            user,
        });
    
    
}

function Get (req, res) {

    const id = req.params.id;

    res.status(200).json({message: 'Created successfull', id})



}


module.exports = { Create, Get };