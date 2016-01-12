/* AG-develop_old 12.7.1-692 (2012-11-07 10:21:50 GMT+00:00) */
rsinetsegs=['D08734_71868','D08734_71869','D08734_71870','D08734_71873','D08734_71874','D08734_71875','D08734_71882','D08734_71889','D08734_71895','D08734_71900','D08734_71904','D08734_71907','D08734_71924','D08734_71928','D08734_73374','D08734_73375','D08734_73377','D08734_73382','D08734_73383','D08734_71893','D08734_73822','A08721_10248'];
if(rsinetsegs.length>0){
var i=1;
var url="//pixel.mathtag.com/event/img?mt_id=153916&mt_adid=106580&no_log=true";
for(var x=0;x<rsinetsegs.length&&url.length<2000;++x){
    if(x>=20){
        url+="&s"+i+"="+rsinetsegs[x];
        i++;}
    else{
            var y=x+1;
            url+="&v"+y+"="+rsinetsegs[x];}
    }
asi_makeGIF(url);}