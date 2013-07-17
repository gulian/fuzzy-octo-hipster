function createCORSRequest(method, url){
	var x = new XMLHttpRequest();
	if ('withCredentials' in x)
		x.open(method, url, true);
	else if (typeof XDomainRequest != 'undefined') {
		x = new XDomainRequest();
		x.open(method, url);
	} else 
		x = null;

	return x;
}

var tags = prompt('Tags (séparés par des virgules)');

if(!tags)
	return ;

var h = new createCORSRequest(),
	url='[[DOMAIN]]/item/',
	params='title='+document.title+'&url='+document.location+'&tags='+tags;
	
h.withCredentials = true;
h.open('POST',url,true);
h.setRequestHeader('Content-type','application/x-www-form-urlencoded');
h.onreadystatechange = function() {
	if(h.readyState == 4 && h.status == 200){
		alert('Lien ajouté avec succés !');
	} else if(h.readyState == 4 && h.status == 403){
		alert("Vous n'êtes pas authentifié");
	}
};

h.send(params);
