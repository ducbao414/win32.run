import simplejson as json
from httplib2 import Http
import re
import urllib2
import sys
import urllib
import urlparse
import xbmc
import xbmcgui
import xbmcplugin

API_BASE = 'http://net.adjara.com/'
STATIC_FILES = 'http://staticnet.adjara.com/'
CATEGORY_MAP = {
    'new_release': 'Search/SearchResults?ajax=1&display=15&startYear=1900&endYear=2018&offset=0&orderBy=date&order%5Border%5D=data&order%5Bdata%5D=premiere&order%5Bmeta%5D=desc',
    'top_movies': 'Search/SearchResults?ajax=1&display=15&startYear=1900&endYear=2018&offset=15&orderBy=date&order%5Border%5D=data&order%5Bdata%5D=views&order%5Bmeta%5D=views-week'
}

base_url = sys.argv[0]
addon_handle = int(sys.argv[1])
args = urlparse.parse_qs(sys.argv[2][1:])
find_var_regex = re.compile(r"""movieUrlEmpty\s*=\s*[\'\"](.+)[\'\"]""")

xbmcplugin.setContent(addon_handle, 'movies')

def get_icon(movie_id):
    movie_id = str(movie_id)
    return STATIC_FILES + 'moviecontent/%s/covers/157x236-%s.jpg' % (movie_id,movie_id)
def get_cover(movie_id):
    movie_id = str(movie_id)
    return STATIC_FILES + 'moviecontent/%s/covers/1920x1080-%s.jpg' % (movie_id,movie_id)

def build_url(query):
    return base_url + '?' + urllib.urlencode(query)

def add_category(label,category,iconImage = 'DefaultFolder.png', url = None):
    if url is None:
        url = build_url({'mode': 'category', 'category': category})
    li = xbmcgui.ListItem(label, iconImage=iconImage)
    xbmcplugin.addDirectoryItem(handle=addon_handle, url=url,
                                listitem=li, isFolder=True)

def main_screen():
    add_category('Search',None,'DefaultAddonsSearch.png',build_url({'mode': 'search'}))
    add_category('New Releases','new_release')
    add_category('Top Movies','top_movies')
    xbmcplugin.endOfDirectory(addon_handle)

def load_category(category):
    cat_url = API_BASE + CATEGORY_MAP[category]
    try:
        (rsp_headers, json_data) = Http().request(cat_url)
        data  = json.loads(json_data)
        for item in data['data']:
            url = build_url({'mode': 'movie', 'id': item['id']})
            li = xbmcgui.ListItem(item['title_en'], iconImage=item['poster'])
            li.setProperty('IsPlayable', 'true')
            xbmcplugin.addDirectoryItem(handle=addon_handle, url=url, listitem=li, isFolder=False)

    except Exception, e:
        xbmc.log('adjaranet: got http error fetching %s \n %s' % (cat_url, str(e)), xbmc.LOGWARNING)
    finally:
        xbmcplugin.endOfDirectory(addon_handle)

def search():
    kb = xbmc.Keyboard('', 'Search for movie')
    kb.doModal()
    if (kb.isConfirmed()):
        search_term = kb.getText()
    else:
        return

    search_url = API_BASE + 'Home/quick_search?ajax=1&search=' + search_term
    try:
        (rsp_headers, json_data) = Http().request(search_url)
        data  = json.loads(json_data)
        for item in data['movies']['data']:
            url = build_url({'mode': 'movie', 'id': item['id']})
            li = xbmcgui.ListItem(item['title_en'])
            li.setArt({
                'icon': get_icon(item['id']),
                'landscape': get_cover(item['id'])
            })
            li.setProperty('IsPlayable', 'true')
            xbmcplugin.addDirectoryItem(handle=addon_handle, url=url, listitem=li, isFolder=False)
    except Exception, e:
        xbmc.log('adjaranet: got http error fetching %s \n %s' % (search_url, str(e)), xbmc.LOGWARNING)
    finally:
        xbmcplugin.endOfDirectory(addon_handle)


def load_movie(movie_id):
    script_url = API_BASE + 'Movie/main?id='+ movie_id +'&js=1'
    try:
        (rsp_headers, html_data) = Http().request(script_url)
        match = re.search(find_var_regex,html_data)
        if not match:
            xbmc.log('can not find url at %s' % (script_url), xbmc.LOGWARNING)
            raise Exception('url not found')
        
        url = match.group(1).replace('{lang}','English').replace('{quality}','1500')
        xbmc.log(url, xbmc.LOGWARNING)
        
        play_item = xbmcgui.ListItem(path=url)
        xbmcplugin.setResolvedUrl(addon_handle, True, listitem=play_item)
    except Exception, e:
        xbmc.log('adjaranet: got http error fetching %s \n %s' % (script_url, str(e)), xbmc.LOGWARNING)

mode = args.get('mode', None)

if mode is None:
    main_screen()
elif mode[0] == 'category':
    category = args.get('category','new_release')
    load_category(category[0])
elif mode[0] == 'search':
    search()
elif mode[0] == 'movie':
    movie_id = args.get('id', None)
    load_movie(movie_id[0])