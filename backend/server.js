
 const teamworkapp = require('./teamworkapp')

 const port = 5000;
teamworkapp.listen(port, () =>{
    console.log("Teamwork App Server running on port: "+ port);
});

