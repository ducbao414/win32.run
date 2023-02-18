import mime_db from './mime.json';

export function compile_params(new_params){
    
    const urlSearchParams = new URLSearchParams(window.location.search);
    let params = Object.fromEntries(urlSearchParams.entries());
    for(let key of Object.keys(new_params)){
        params[key] = new_params[key];
    }
    return params = Object.keys(params)
    .filter(key => params[key] != null)
    .map(key => `${key}=${params[key]}`)
    .join('&').trim();
}

export function is_empty(str){
    return str == null || str.trim().length == 0;
}

export function includes(value, array){
    if(!Array.isArray(array)) array = [];
    return array.some(elm => elm.equals(value));
}


function parent_match_selector (target, selector) {
  return [...document.querySelectorAll(selector)].some(el =>
    el === target || el.contains(target)
  )
}

// usage
// hasParentWithMatchingSelector(myElement, '.some-class-name');

/** Dispatch event on click outside of node */
export function click_outside(node) {
  
    const handleClick = event => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        if(parent_match_selector(event.target, '.context-menu')) return;
        if(parent_match_selector(event.target, '.toolbar-menu')) return;
        
        if(parent_match_selector(event.target, '.tox-tinymce-aux')) return;
        
        if(parent_match_selector(event.target, '#start-menu-btn')
        && node == document.querySelector('#start-menu')) return;

        if(node.classList.contains('window')){
          let program_id = node.getAttribute('program-id');
          if(program_id){
            let selector = `.program-tile[program-id="${program_id}"]`;
            if(parent_match_selector(event.target, selector)) return;
          }
        }
        

        node.dispatchEvent(
          new CustomEvent('click_outside', node)
        )
      }
    }
  
    document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    }
}


export function pick_one(arr){
  return arr[random_int(0, arr.length - 1)];
}

export function random_int(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


let system_files = ["shells","command","shell","file","and","directory","name","automatic","completion","reference","a-z","powershell","cscript","wscript","debug","system","error","codes","using","redirection","operators","core","virtual","key","reg_dword","active","add","alias","volume","append","arp","assign","assoc","at","atmadm","attach-vdisk","attrib","attributes","disk","auditpol","backup","clear","get","list","remove","resourcesacl","restore","set","autochk","autoconv","autofmt","automount","bcdboot","bcdedit","bdehdcfg","driveinfo","newdriveletter","quiet","restart","size","target","begin","bitsadmin","addfile","addfileset","addfilewithranges","cache","delete","deleteurl","getexpirationtime","getlimit","help","info","setexpirationtime","setlimit","cancel","complete","create","examples","getaclflags","getbytestotal","getbytestransferred","getclientcertificate","getcompletiontime","getcreationtime","getcustomheaders","getdescription","getdisplayname","geterror","geterrorcount","getfilestotal","getfilestransferred","gethelpertokenflags","gethelpertokensid","gethttpmethod","getmaxdownloadtime","getminretrydelay","getmodificationtime","getnoprogresstimeout","getnotifycmdline","getnotifyflags","getnotifyinterface","getowner","getpeercachingflags","getpriority","getproxybypasslist","getproxylist","getproxyusage","getreplydata","getreplyfilename","getreplyprogress","getsecurityflags","getstate","gettemporaryname","gettype","getvalidationstate","listfiles","makecustomheaderswriteonly","monitor","nowrap","peercaching","getconfigurationflags","setconfigurationflags","peers","discover","rawreturn","removeclientcertificate","removecredentials","replaceremoteprefix","reset","resume","setaclflag","setclientcertificatebyid","setclientcertificatebyname","setcredentials","setcustomheaders","setdescription","setdisplayname","sethelpertoken","sethelpertokenflags","sethttpmethod","setmaxdownloadtime","setminretrydelay","setnoprogresstimeout","setnotifycmdline","setnotifyflags","setpeercachingflags","setpriority","setproxysettings","setreplyfilename","setsecurityflags","setvalidationstate","suspend","takeownership","transfer","util","enableanalyticchannel","getieproxy","repairservice","setieproxy","version","wrap","bootcfg","addsw","copy","dbg1394","default","ems","query","raw","rmsw","timeout","break","cacls","call","cd","certreq","certutil","change","logon","port","user","chcp","chdir","chglogon","chgport","chgusr","chkdsk","chkntfs","choice","cipher","clean","cleanmgr","clip","cls","cmd","cmdkey","cmstp","color","comp","compact","vdisk","convert","basic","dynamic","gpt","mbr","cprofile","partition","efi","extended","logical","msr","primary","mirror","raid","simple","stripe","date","dcgpofix","defrag","del","shadows","detach","detail","dfsdiag","testdcs","testdfsconfig","testdfsintegrity","testreferral","testsites","dfsrmig","diantz","dir","diskcomp","diskcopy","diskpart","diskperf","diskraid","diskshadow","dispdiag","dnscmd","doskey","driverquery","echo","edit","endlocal","end","erase","eventcreate","eventquery","eventtriggers","evntcmd","exec","exit","expand","expose","extend","extract","fc","filesystems","find","findstr","finger","flattemp","fondue","for","forfiles","format","freedisk","fsutil","8dot3name","behavior","dirty","fsinfo","hardlink","objectid","quota","repair","reparsepoint","resource","sparse","tiering","transaction","usn","wim","ftp","ascii","bell","binary","bye","close","disconnect","glob","hash","lcd","literal","ls","mget","mkdir","mls","mput","open","prompt","put","pwd","quit","quote","recv","remotehelp","rename","rmdir","send","status","trace","type","verbose","mdelete","mdir","ftype","fveupdate","getmac","goto","gpfixup","gpresult","gpupdate","graftabl","helpctr","hostname","icacls","if","import","(shadowdisk)","(diskpart)","inactive","inuse","ipconfig","ipxroute","irftp","jetpack","klist","ksetup","addenctypeattr","addhosttorealmmap","addkdc","addkpasswd","addrealmflags","changepassword","delenctypeattr","delhosttorealmmap","delkdc","delkpasswd","delrealmflags","domain","dumpstate","getenctypeattr","listrealmflags","mapuser","removerealm","server","setcomputerpassword","setenctypeattr","setrealm","setrealmflags","ktmutil","ktpass","label","providers","writers","load","metadata","lodctr","logman","alert","api","cfg","counter","export","start","stop","update","logoff","lpq","lpr","macfile","makecab","manage","bde","on","off","pause","lock","unlock","autounlock","protectors","tpm","setidentifier","forcerecovery","changepin","changekey","keypackage","upgrade","wipefreespace","mapadmin","md","merge","mklink","mmc","mode","more","mount","mountvol","move","mqbkup","mqsvc","mqtgsvc","msdt","msg","msiexec","msinfo32","mstsc","nbtstat","netcfg","netdom","net","print","netsh","netstat","nfsadmin","nfsshare","nfsstat","nlbmgr","nltest","nslookup","lserver","root","all","class","d2","querytype","recurse","retry","search","srchlist","vc","view","ntbackup","ntcmdprompt","ntfrsutl","offline","online","openfiles","pagefileconfig","path","pathping","pbadmin","pentnt","perfmon","ping","pktmon","pnpunattend","pnputil","popd","ise","prncnfg","prndrvr","prnjobs","prnmngr","prnport","prnqctl","pubprn","pushd","pushprinterconnections","pwlauncher","pwsh","qappsrv","qprocess","process","session","termserver","quser","qwinsta","rcp","rd","rdpsign","recover","group","refsutil","reg","compare","save","unload","regini","regsvr32","relog","rem","ren","repadmin","replace","rescan","retain","revert","rexec","risetup","robocopy","route","ws2008","rpcinfo","rpcping","rsh","rundll32","printui","rwinsta","san","sc","config","schtasks","scwcmd","analyze","configure","register","rollback","transform","secedit","generaterollback","validate","select","serverceipoptin","servermanagercmd","serverweroptin","environmental","variables","shadow","context","id","setlocal","option","setx","sfc","shift","showmount","shrink","shutdown","simulate","sort","subcommand","device","drivergroup","drivergroupfilter","driverpackage","image","imagegroup","transportserver","multicasttransmission","namespace","subst","sxstrace","sysocmgr","systeminfo","takeown","tapicfg","taskkill","tasklist","tcmsetup","telnet","display","unset","tftp","time","title","tlntadmn","tpmtool","tpmvscmgr","tracerpt","tracert","tree","tscon","tsdiscon","tsecimp","tskill","tsprof","typeperf","tzutil","unexpose","uniqueid","unlodctr","ver","verifier","verify","vol","vssadmin","resize","shadowstorage","waitfor","wbadmin","catalog","systemstatebackup","disable","enable","disks","items","versions","recovery","sysrecovery","systemstaterecovery","job","wdsutil","wecutil","wevtutil","where","whoami","winnt","winnt32","winpop","winrs","winsat","mem","mfmedia","wmic","writer","xcopy"];

export function random_files(){
  
  return pick_one(system_files)
   + '.' + pick_one(['dll', 'icm', 'sys', 'inf', 'bin', 'exe'])
}

export function sleep(ms) {
  return new Promise((resolve) => {
  setTimeout(resolve, ms);
  });
} 

export function parse_bool(value){
  try {
    value = JSON.parse(value)
  } catch (error) {
    value = false;
  }
  if(typeof value == 'boolean'){
    return value;
  } else {
    return false;
  }
}

export function is_installing_windows(){
  let value = localStorage.getItem('is_installing_windows');
  return parse_bool(value)
}
export function set_installing_windows(value){
  value = parse_bool(value);
  localStorage.setItem('is_installing_windows', value);
}

export function set_theme(theme='xp'){
  if(theme == 'xp'){
    document.querySelector('#theme').href = 'https://unpkg.com/xp.css';
  } else if(theme == 'none'){
    document.querySelector('#theme').href = '';
  }
  
}

export function clone(obj){
  return JSON.parse(JSON.stringify(obj));
}

export function relative_rect(parent, child){
  return {
    top: child.top - parent.top, 
    left: child.left - parent.left,
    right: parent.right - child.right,
    bottom: parent.bottom - child.bottom
  }
}

export function format_time(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s
  ].filter(Boolean).join(':');
}

export function extname(path) {
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
}

export function basename(path, ext) {
  if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
  

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
    if (ext.length === path.length && ext === path) return '';
    var extIdx = ext.length - 1;
    var firstNonSlashEnd = -1;
    for (i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
        if (firstNonSlashEnd === -1) {
          // We saw the first non-path separator, remember this index in case
          // we need it if the extension ends up not matching
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          // Try to match the explicit extension
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              // We matched the extension, so mark this as the end of our path
              // component
              end = i;
            }
          } else {
            // Extension does not match, so our result is the entire path
            // component
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }

    if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
    return path.slice(start, end);
  } else {
    for (i = path.length - 1; i >= 0; --i) {
      if (path.charCodeAt(i) === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // path component
        matchedSlash = false;
        end = i + 1;
      }
    }

    if (end === -1) return '';
    return path.slice(start, end);
  }
}

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function ext_to_mime(name, default_mime=null){
  if(name == null) return default_mime;
  name = 'something' + name;
  let ext = extname(name);
  let type = mime_db.find(el => el.ext == ext);
  
  if(type != null){
    return type.mime
  } else {
    return default_mime;
  }
}

export function get_filetype(file){
  let type = mime_db.find(el => el.mime == file.type);
  if(type == null){
    return {
      ext: extname(file.name || '_.txt'),
      name: (file.type || 'text/plain') + ` (${extname(file.name || '_.txt')})`,
      mime: file.type || 'text/plain'
    }
  } else {
    return type;
  }
}

export function data_url_to_blob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]); //Buffer.from(dataURI, 'base64');

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

export function sanitize_filename(name){
  return name.split('\\').join('').split('/').join('');
}

export function browser_window(){
  return window;
}

export function timestamp_to_readable(timestamp){
  let date = new Date();
  date.setTime(timestamp);
  return date.toString();
}