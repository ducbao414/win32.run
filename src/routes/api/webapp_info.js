import axios from 'axios';
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

async function crawl(webapp_url){
    if(webapp_url == null){
        return null;
    }
    if(!webapp_url.toLowerCase().startsWith('https://') && !webapp_url.toLowerCase().startsWith('http://')){
        webapp_url = 'https://' + webapp_url;
    }
    let webapp = {
        url: webapp_url,
        icon: '/images/xp/icons/ApplicationWindow.png',
        name: 'Untitled Program',
        desc: ''
    }
    try {
        let response = await axios.get(webapp_url);
        response.url = response.config.url;
        if(response.headers['x-frame-options'] != null){
            return null;
        }
        let data  = await getPreviewFromContent(response);
        if(!is_empty(data.siteName)){
            webapp.name = data.siteName;
        } else if(!is_empty(data.title)){
            webapp.name = data.title;
        } 
        if(data.favicons != null && data.favicons.length >= 1){
            webapp.icon = data.favicons[data.favicons.length - 1]
        }
        webapp.desc = data.description || '';
    } catch (error) {
        
    }
    return webapp;
}

function is_empty(str){
    return str == null || str.trim() == '';
}

export async function GET({request}){
    let webapp_url = request.headers.get('webapp_url');
    console.log(webapp_url);
    
    let webapp = await crawl(webapp_url);
    
    return {
        status: 200,
        body: { webapp }
    }
}