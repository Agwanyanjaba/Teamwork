const express = require('express');
const cors = require('cors');
//const router = express.Router();
const bodyParser = require('body-parser');
teamworkapp = express();


teamworkapp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
teamworkapp.use(bodyParser.json());

//teamworkapp.use(router);

const pool  =  require('./configs/config');

//API to view all employee in Teamwork
teamworkapp.get('/v1/allusers', function (req, res, next) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM employees',function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

teamworkapp.post('/v1/auth/create-user', function (req, res, next) {
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        } 
    const values = [ req.body.email, 
                     req.body.firstname,
                     req.body.lastname, 
                     req.body.password,
                     req.body.gender,
                     req.body.jobrole,
                     req.body.department,
                     req.body.address,
                     req.body.role
                    ]
     client.query(`INSERT INTO employees (email, firstname, lastname, password , gender , jobrole , department, address, role)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 )`, values, function(error, result){
                    done();
                     if(error) return next(error);
                     res.status(200).json("Employee Added Successfully!");
            });
            console.log(values);
        })
    });

//API to handle posting of an article by authenticated employee
    teamworkapp.post('/v1/articles', function (req, res, next) {
        pool.connect(function(error,client,done) {
            if(error){
                console.log("not able to get connection "+ error);
                res.status(400).send(error);
            } 
        const values = [ req.body.articleId, 
                        req.body.title,
                        req.body.body, 
                        req.body.email,
                        req.body.dateCreated,
                        req.body.status,
                        req.body.visible,
                        ]
         client.query(`INSERT INTO articles (articleId,title ,body ,email ,dateCreated,status,visible)
                    VALUES($1, $2, $3, $4, $5, $6, $7)`, values, function(error, result){
                        done();
                         if(error) return next(error);
                         res.status(200).json("Article Added Successfully!");
                });
                console.log(values);
            })
        });

        // API to delete an Article with specific ID 
        teamworkapp.delete('/v1/articles/delete/:id', (req, res, next) => {
            
            pool.connect(function(error,client,done) {
                if(error){
                    console.log("not able to get connection "+ error);
                    res.status(400).send(error);
                }
                 //DELETE from articles where articleid='1';
                 const articleId = req.params.id
                 console.log(articleId+ "ID from postman");
                client.query(`DELETE FROM articles WHERE articleid = $1`, [ articleId ],
                        function(error, result){
                            done();
                            if(error) return next(error);
                            res.status(200).json({"Status":"Success",
                            "Data":"Article deleted successfully!"});
                        }
                 )
          }) 
        });

        //API to update article with specific ID
        teamworkapp.patch('/v1/articles/patch/:id', (req, res, next) => {
            
            pool.connect(function(error,client,done) {
                if(error){
                    console.log("not able to get connection "+ error);
                    res.status(400).send(error);
                }
                 
                 const values = [
                    articleId = req.params.id,
                    req.body.title,
                    req.body.body, 
                    req.body.dateCreated
                 ];

                 console.log(values + "Values from postman");
                client.query(`UPDATE articles SET title= $2,  body= $3, datecreated= $4 WHERE articleid = $1`, values,
                        function(error, result){
                            done();
                            if(error)  return next(error);
                            res.status(200).json({"Status":"Success",
                            "Data":"Article Updated successfully!"});
                            console.log('Article Updated successfully!');
                        }
                 )
          }) 
        });
        
        //API to get all articles posted in teamwork arranged in ascending order
        teamworkapp.get('/v1/articles', function (req, res, next) {
            pool.connect(function(err,client,done) {
               if(err){
                   console.log("not able to get connection "+ err);
                   res.status(400).send(err);
               } 
               client.query('SELECT * FROM articles ORDER BY datecreated DESC',function(err,result) {
                   done(); // closing the connection;
                   if(err){
                       console.log(err);
                       res.status(400).send(err);
                   }
                   res.status(200).send(result.rows);
               });
            });
        });
/* 
This section handles GIFS
*/

   //API to handle creation of a Gif by authenticated emplyee
   teamworkapp.post('/v1/gifs', function (req, res, next) {
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        } 
    const values = [ req.body.gifid, 
                    req.body.url,
                    req.body.email, 
                    req.body.datecreated,
                    req.body.status,
                    req.body.visible,
                    ]
     client.query(`INSERT INTO gifs (gifid,url, email, datecreated,	status,	visible)
                VALUES($1, $2, $3, $4, $5, $6)`, values, function(error, result){
                    done();
                     if(error) return next(error);
                     res.status(200).json("GIF Added Successfully!");
            });
            console.log(values);
        })
    });

   // API to delete an Gif with specific ID 
   teamworkapp.delete('/v1/gifs/delete/:id', (req, res, next) => {
            
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        }
         
         const articleId = req.params.id
         console.log(articleId+ "ID from postman");
        client.query(`DELETE FROM gifs WHERE gifid = $1`, [ articleId ],
                function(error, result){
                    done();
                    if(error) return next(error);
                    res.status(200).json({"Status":"Success",
                    "Data":"GIF deleted successfully!"});
                }
         )
  }) 
});

//API to update gifs with specific ID
teamworkapp.patch('/v1/gifs/patch/:id', (req, res, next) => {
    
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        }
         
         const values = [
            req.params.gifid, 
            req.body.datecreated,
            req.body.status,
            req.body.visible
         ];

         console.log(values + "Values from postman");
        client.query(`UPDATE gifs SET status= $3,  visible= $4, datecreated= $2 WHERE gifid = $1`, values,
                function(error, result){
                    done();
                    if(error)  return next(error);
                    res.status(200).json({"Status":"Success",
                    "Data":"GIF Updated successfully!"});
                    console.log('GIF Updated successfully!');
                }
         )
  }) 
});

//API to get all gifs posted in teamwork arranged in ascending order
teamworkapp.get('/v1/gifs', function (req, res, next) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM gifs ORDER BY datecreated DESC',function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});


/* 
This section handles Artciles - Comments
*/

   //API to handle posting of a comment by authenticated emplyee
   teamworkapp.post('/v1/articles/comment', function (req, res, next) {
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        } 
       
        
    const values = [ req.body.commentid, 
                    req.body.comment,
                    req.body.email, 
                    req.body.articleid,
                    req.body.datecreated
                    ]
     client.query(`INSERT INTO articlecomments (commentid ,comment, email ,articleid, datecreated)
                VALUES($1, $2, $3, $4, $5)`, values, function(error, result){
                    done();
                     if(error) return next(error);
                     res.status(200).json("GIF Added Successfully!");
            });
            console.log(values);
        })
    });

   // API to delete a comment with specific ID 
   teamworkapp.delete('/v1/articles/comments/delete/:id', (req, res, next) => {
            
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        }
         
         const articleId = req.params.id
         console.log(articleId+ "ID from postman");
        client.query(`DELETE FROM articlecomments WHERE gifid = $1`, [ articleId ],
                function(error, result){
                    done();
                    if(error) return next(error);
                    res.status(200).json({"Status":"Success",
                    "Data":"GIF deleted successfully!"});
                }
         )
  }) 
});

//API to update article comment with specific ID
teamworkapp.patch('/v1/articles/comments/patch/:id', (req, res, next) => {
    
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        }
         
         const values = [
            req.params.gifid, 
            req.body.datecreated,
            req.body.status,
            req.body.visible
         ];

         console.log(values + "Values from postman");
        client.query(`UPDATE articlecomments SET status= $3,  visible= $4, datecreated= $2 WHERE gifid = $1`, values,
                function(error, result){
                    done();
                    if(error)  return next(error);
                    res.status(200).json({"Status":"Success",
                    "Data":"GIF Updated successfully!"});
                    console.log('Comment Updated successfully!');
                }
         )
  }) 
});

//API to get all article-commnts posted in teamwork arranged in ascending order
teamworkapp.get('/v1/articles/comments', function (req, res, next) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM articlecomments ORDER BY datecreated DESC',function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});


/* 
This section handles gifs - Comments
*/

   //API to handle posting of a comment by authenticated employee for a given gif
   teamworkapp.post('/v1/gifs/comment', function (req, res, next) {
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        } 
       
        
    const values = [ req.body.commentid, 
                    req.body.comment,
                    req.body.email, 
                    req.body.gifid,
                    req.body.datecreated
                    ]
     client.query(`INSERT INTO gifcomments (commentid ,comment, email ,gifid, datecreated)
                VALUES($1, $2, $3, $4, $5)`, values, function(error, result){
                    done();
                     if(error) return next(error);
                     res.status(200).json("Comment Added Successfully!");
            });
            console.log(values);
        })
    });

   // API to delete a comment with specific ID 
   teamworkapp.delete('/v1/gifs/comments/delete/:id', (req, res, next) => {
            
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        }
         
         const values = [commentid = req.params.id,
            email = req.body.email]
             
        console.log(commentid+ "ID from postman");
        console.log(email+ "Email from postman");
        client.query(`DELETE FROM gifcomments WHERE commentid = $1 and email = $2`, values,
                function(error, result){
                    done();
                    if(error) return next(error);
                    res.status(200).json({"Status":"Success",
                    "Data":"Comment deleted successfully!"});
                }
         )
  }) 
});

//API to update article comment with specific ID
teamworkapp.patch('/v1/gifs/comments/patch/:id', (req, res, next) => {
    
    pool.connect(function(error,client,done) {
        if(error){
            console.log("not able to get connection "+ error);
            res.status(400).send(error);
        }
         
         const values = [
            req.params.gifid, 
            req.body.datecreated,
            req.body.status,
            req.body.visible
         ];

         console.log(values + "Values from postman");
        client.query(`UPDATE gifcomments SET status= $3,  visible= $4, datecreated= $2 WHERE gifid = $1`, values,
                function(error, result){
                    done();
                    if(error)  return next(error);
                    res.status(200).json({"Status":"Success",
                    "Data":"GIF Updated successfully!"});
                    console.log('Comment Updated successfully!');
                }
         )
  }) 
});

//API to get all gifid-comments posted in teamwork arranged in ascending order
teamworkapp.get('/v1/gifs/comments', function (req, res, next) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM gifcomments ORDER BY datecreated DESC',function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});


module.exports = teamworkapp;