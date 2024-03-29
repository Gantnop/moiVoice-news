import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewsUpdating(){
    const navigate=useNavigate();

    var [newsSection,set_newsSection]=useState('lifestyle');
    var [newsHeadline,set_newsHeadline]=useState('');
    var [newsBody,set_newsBody]=useState('');
    var [newsPhoto,set_newsPhoto]=useState(null);

    axios.get('http://localhost:9000/userLevel')
         .then((response)=>{
            // console.log(response.data.userLevel)
            if(response.data.userLevel!==1){
                navigate('/login')
            }
         })

    async function upload(){
        var formData=new FormData();

        formData.append('file',newsPhoto);
        console.log("the file",formData)
        const res=await axios.post('http://localhost:9000/upload',formData)
            
        return res.data;

    }

    async function updateNews(e){
        e.preventDefault();

        console.log(newsBody,"\n",newsHeadline,"\n",newsSection,"\n",newsPhoto.name.replace(/ /g,"_"))
        
        const imgUrl=await upload();
        console.log("imgUrl",imgUrl)

        await axios.post('http://localhost:9000/updateNews',
                    {
                        headers: { 'content-type': 'multipart/form-data' },
                        newsSection:newsSection,
                        newsHeadline:newsHeadline,
                        newsBody:newsBody,
                        withCredentials:true,
                        img:imgUrl
                    },
                    )
             .then((response)=>{
                if(response.status===200){
                    navigate('/');
                }
             })
             .catch((err)=>{
                console.log(err)
                if(err.response.status===401){
                    navigate('/login');
                }
             })
             
    }

    

    return(
        <div className="container">
            <h1>MoiVoice</h1>
            <h3> News Updating Page!</h3>
            <form  onSubmit={updateNews} enctype="multipart/form-data">

                <div className="d-flex ">
                    <p className="col-md-3">News Section:</p>
                    <select name="newsSection" className="col-md-6" value={newsSection} onChange={(e)=>set_newsSection(e.target.value)}>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="sports">Sports</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="academics">Academics</option>
                        <option value="health"> Health</option>
                        <option value="business">Business </option>
                        <option value="politics"> Politics</option>


                    </select>
                </div>
                
                <div className="d-flex mb-3 mt-3">
                    <p className="col-md-3">News Headline:</p>
                    <input type="text"  name="newsHeadline" className="col-md-6"
                           placeholder="The news headline"  minlength="8" maxlength="200"required value={newsHeadline}
                           onChange={(e)=>set_newsHeadline(e.target.value)}
                    />
                </div>

                <div className="d-flex">
                    <p className="col-md-3">News Article:
                    <textarea name="newsArticle"  rows="20" cols="82" value={newsBody} onChange={(e)=>set_newsBody(e.target.value)}>
                        Write the News composition here!
                    </textarea>
                    </p>
                </div>

                <div>
                    <label class="flex">select a News photo to upload:</label>
                    <input type="file"  onChange={(e)=>set_newsPhoto(e.target.files[0])}/>
                    
                </div>
                
                <input type="submit" value="Update"/>
                
            </form>
        </div>
    )
}