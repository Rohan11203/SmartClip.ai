 

export async function Signup(req:any,res:any) {
  try {
    const data = req.body
    console.log(data);
    res.send({
      data
    })
  } catch (e) {
    res.json({
        message: ""
    })
  }
}
