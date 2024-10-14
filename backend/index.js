const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bcrypt = require('bcryptjs')

const app = express();
app.use(express.json())
app.use(cors())
const PORT = 1234;


const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:"messagingAssignment"
})
con.connect((err)=>{
    if(err){
            console.log("error")
    }else{
        console.log("DB Connected")
    }
});


app.post('/updateOnlineStatus', (req, res) => {
    const { userId, isOnline } = req.body;

    const sql = 'UPDATE user_registration SET isOnline = ? WHERE id = ?';
    con.query(sql, [isOnline, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating status' });
        }
        res.status(200).json({ message: 'Status updated' });
    });
});

app.post("/userregistration",async(req,res)=>{
    try{
        const{name,email,mobile,role,password} = req.body;

        const sql = 'INSERT INTO user_registration (name,email,mobile,role,password) VALUES (?, ?, ?, ?, ?)';

        con.query(sql, [name,email,mobile,role,password], (err,result) => {
            if(err){
                console.log("Database insertion error:", err);
                return res.status(500).json({ "error": "Database insertion failed" });
              }
              res.status(200).json({ "msg": "Patient registered successfully" });
        })
    } catch(err){
        res.status(500).json({"err":"Internal Server Error"})
    }
})

app.post('/userLogin', async(req,res) => {
    try{
        const {email, password} = req.body;

        const sql = 'SELECT * FROM user_registration WHERE email = ? AND password = ?';

        con.query(sql, [email,password], (err, result) => {
            if(err){
                res.status(500).json({"err":"Internal Server Error"})
            } else if(result.length === 0){
                res.status(401).json({'err':'Email or Password are incorrect'})
            } else{
                const user = result[0];
                res.status(200).json({'msg':'Login Successful',user:user})
            }
        })

    } catch(err){
        res.status(500).json({'err':"Internal SErver error"})
    }
})

app.get("/fetchDetail", async (req, res) => {
    const sql = 'SELECT * FROM user_registration';

    con.query(sql, (err, result) => {
        if (err) {
            console.log("Error fetching data:", err);
            return res.status(500).json({ "err": "Internal Server Error" });
        }
        res.status(200).json(result);
    });
});

app.post('/sendMessage', (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
    
    con.query(sql, [sender_id, receiver_id, message], (err, result) => {
        if (err) return res.status(500).json({ err: 'Failed to send message' });
        res.status(200).json({ msg: 'Message sent successfully' });
    });
});

app.get('/fetchMessages', (req, res) => {
    const { sender_id, receiver_id } = req.query;
    const sql = 'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC';
    
    con.query(sql, [sender_id, receiver_id, receiver_id, sender_id], (err, result) => {
        if (err) return res.status(500).json({ err: 'Failed to fetch messages' });
        res.status(200).json(result);
    });
});

app.get('/getUser/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM user_registration WHERE id = ?';

    con.query(sql, [id], (err, result) => {
        if (err) {
            console.log("Error fetching user:", err);
            return res.status(500).json({ "err": "Failed to fetch user" });
        }
        if (result.length === 0) {
            return res.status(404).json({ "err": "User not found" });
        }
        res.status(200).json(result[0]);
    });
});

app.post('/updateUser', (req, res) => {
    const { id, name, email, mobile, role, password } = req.body;

    const sql = 'UPDATE user_registration SET name = ?, email = ?, mobile = ?, role = ?, password = ? WHERE id = ?';
    con.query(sql, [name, email, mobile, role, password, id], (err, result) => {
        if (err) {
            console.log("Error updating user:", err);
            return res.status(500).json({ "err": "Failed to update user" });
        }
        res.status(200).json({ "msg": "User updated successfully" });
    });
});

app.delete('/deleteUser/:id', (req, res) => {
    const detailID = req.params.id;

    const deleteMessagesSql = 'DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?';

    con.query(deleteMessagesSql, [detailID, detailID], (err, result) => {
        if (err) {
            console.log("Error deleting messages:", err);
            return res.status(500).json({ "err": "Failed to delete messages", "details": err.message });
        }

        const deleteUserSql = 'DELETE FROM user_registration WHERE id = ?';
        con.query(deleteUserSql, [detailID], (err, result) => {
            if (err) {
                console.log("Error deleting user:", err);
                return res.status(500).json({ "err": "Failed to delete user", "details": err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ "msg": "User not found" });
            }

            res.status(200).json({ "msg": "User and related messages deleted successfully" });
        });
    });
});



app.listen(PORT, ()=>{console.log(`Connection build on PORT :- ${PORT}`)})
