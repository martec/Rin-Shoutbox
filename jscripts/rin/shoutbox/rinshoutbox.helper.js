/**
 * Rin Shoutbox
 * https://github.com/martec
 *
 * Copyright (C) 2015-2016, Martec
 *
 * Rin Shoutbox is licensed under the GPL Version 3, 29 June 2007 license:
 *	http://www.gnu.org/copyleft/gpl.html
 *
 * @fileoverview Rin Shoutbox - Firebase Shoutbox for Mybb
 * @author Martec
 * @requires jQuery, Firebase, Mybb
 * @credits sound file by http://community.mybb.com/user-70405.html
 */
var loadimg = 1;
function escapeHtml(text) {
  var map = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function revescapeHtml(text) {
  var map = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#039;': "'"
  };

  return text.replace(/(&amp;|&lt;|&gt;|&quot;|&#039;)/g, function(m) { return map[m]; });
}

function badwordreplace(msg,badwl) {
	for (var val in badwl) {
		msg = msg.replace(new RegExp('\\b'+val+'\\b', "gi"), badwl[val]);
	}
	return msg;
}

function regexment(text,nick) {
	var mentregex = text.match(/(?:^|\s)@&quot;([^<]+?)&quot;|(?:^|\s)@&#039;([^<]+?)&#039;|(?:^|\s)@[`´]([^<]+?)[`´]|(?:^|\s)@(?:([^"<>\.,;!?()\[\]{}&\'\s\\]{3,}))/gmi);
	if (mentregex) {
		var patt = new RegExp(nick, "gi");
		for (var i =0;i<mentregex.length;i++) {
			mentregex[i] = mentregex[i].replace(/(&quot;|&#039;|`|´)/g, '');
			if(nick.length == (String(mentregex[i]).trim().length - 1)) {
				res = patt.exec(mentregex[i]);
				if (nick.toUpperCase() == String(res).toUpperCase()) {
					return 1;
				}
				return 0;
			}
			return 0;
		}
		return 0;
	}
	return 0;
}

function regexrin(message) {
	format_search =	 [
		/\[url=(.*?)\](.*?)\[\/url\]/ig,
		/\[spoiler\](.*?)\[\/spoiler\]/ig,
		/(^|[^"=\]])(https?:\/\/[a-zA-Z0-9\.\-\_\-\/]+(?:\?[a-zA-Z0-9=\+\_\;\-\&]+)?(?:#[\w]+)?)/gim,
		/(^|[^"=\]\>\/])(www\.[\S]+(\b|$))/gim,
		/(^|[^"=\]])(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim
	],
	// The matching array of strings to replace matches with
	format_replace = [
		'<a href="$1" target="_blank">$2</a>',
		"<tag><div style=\"margin: 5px\"><div style=\"font-size:11px; border-radius: 3px 3px 0 0 ; padding: 4px; background: #f5f5f5;border:1px solid #ccc;font-weight:bold;color:#000;text-shadow:none; \">"+spo_lan+":&nbsp;&nbsp;<input type=\"button\" onclick=\"if (this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display != '') { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = '';this.innerText = ''; this.value = '"+hide_lan+"'; } else { this.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = 'none'; this.innerText = ''; this.value = '"+show_lan+"'; }\" style=\"font-size: 9px;\" value=\""+show_lan+"\"></div><div><div style=\"border:1px solid #ccc; border-radius: 0 0 3px 3px; border-top: none; padding: 4px;display: none;\">$1</div></div></div></tag>",
		'$1<a href="$2" target="_blank">$2</a>',
		'$1<a href="http://$2" target="_blank">$2</a>',
		'<a href="mailto:$1">$1</a>'
	];
	// Perform the actual conversion
	for (var i =0;i<format_search.length;i++) {
		message = message.replace(format_search[i], format_replace[i]);
	}

	for (var val in rinshoutbox_smilies) {
		message = message.replace(new RegExp(''+val+'(?!\\S)', "gi"), rinshoutbox_smilies[val]);
	}
	message = badwordreplace(message);
	return message;
}

function imgconv(type) {
	$("div."+type+"").find( "a[href*='.jpg'], a[href*='.gif'], a[href*='.png']" ).each(function(e) {
		var imgsrc = $(this).attr('href');
		if (aimgrepl.trim()) {
			imgsrc = aimgrepl.replace(/\$1/g, escapeHtml(imgsrc));
		}
		if (!$(this).children("img").length) {
			$(this).empty().append( '<img src="'+ imgsrc +'" style="max-width:80px; max-height:80px" />' );
		}
	});
}

function scrollrin(key,area,ckold,imarea) {
	if ((($(""+area+"").scrollTop() + $(""+area+"").outerHeight()) > ($(""+area+"")[0].scrollHeight - 90)) || ckold=='old') {
		imgarea = key;
		if (ckold=='old') {
			imgarea = imarea;
		}
		$(""+area+"").animate({scrollTop: ($(""+area+"")[0].scrollHeight)}, 10);
		$("div."+imgarea+" img").one("load", function() {
			$(""+area+"").animate({scrollTop: ($(""+area+"")[0].scrollHeight)}, 10);
		}).each(function() {
			if(this.complete) $(this).load();
		});
	}
}

function scrollrinlog() {
	$(".logstyle").animate({scrollTop: ($(".logstyle")[0].scrollHeight)}, 10);
	$("div.msglog img").one("load", function() {
		$(".logstyle").animate({scrollTop: ($(".logstyle")[0].scrollHeight)}, 10);
	}).each(function() {
		if(this.complete) $(this).load();
	});
}

function autocleaner(area,count,numshouts,direction) {
	if($(""+area+"").children("div."+count+"").length>(parseInt(numshouts) - 1)) {
		dif = $(""+area+"").children("div."+count+"").length - (parseInt(numshouts) - 1);
		if(direction=='top'){
			$(""+area+"").children("div."+count+"").slice(-dif).remove();
		}
		else {
			$(""+area+"").children("div."+count+"").slice(0, dif).remove();
		}
	}
	setTimeout(function() {
		if ($('.shoutarea').children("[data-ment=yes]").length) {
			document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
		}
		else {
			document.title = orgtit;
		}
	},200);
}

function shoutgenerator(reqtype,key,colorsht,font,size,bold,avatar,hour,username,message,type,ckold,direction,numshouts,cur,edtusr) {
	var preapp = edtspan = area = scrollarea = count = usravatar = shoutstyle = '';
	if(direction=='top'){
		preapp = 'prepend';
		if (reqtype == 'logback') {
			preapp = 'append';
		}
	}
	else {
		preapp = 'append';
		if (reqtype == 'logback') {
			preapp = 'prepend';
		}
	}
	if (reqtype=="shout") {
		area = scrollarea = ".shoutarea";
		count = "msgstcount";
		autocleaner(area,count,numshouts,direction);
	}
	else {
		area = ".loglist";
		scrollarea = ".logstyle";
		count = "msglog";
	}
	if (parseInt(dcusrname)) {
		username = username.replace(/(<([^>]+)>)/ig,"");
	}
	if (parseInt(actavat)) {
		if (avatar.trim()) {
			usravatar = "<span class='rsb_tvatar'><img src="+escapeHtml(avatar)+" /></span>";
		}
		else {
			usravatar = "<span class='rsb_tvatar'><img src='"+imagepath+"/default_avatar.png' /></span>";
		}
	}
	if (parseInt(actcolor)) {
		if (colorsht) {
			if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorsht)) {
				shoutstyle += 'color:'+colorsht+';';
			}
		}
	}
	if (parseInt(actbold)) {
		if (parseInt(bold)===1) {
			shoutstyle += 'font-weight:bold;';
		}
	}
	if (!parseInt(destyl)) {
		if (font.trim()) {
			font_rls = rsbfontype.split(',');
			if (typeof font_rls[parseInt(font)] !== 'undefined') {
				shoutstyle += "font-family:"+font_rls[parseInt(font)].trim()+";";
			}
		}
		if (size.trim()) {
			size_rls = rsbfontsize.split(',');
			if (typeof size_rls[parseInt(size)] !== 'undefined') {
				shoutstyle += 'font-size:'+size_rls[parseInt(size)].trim()+'px;';
			}
		}
	}
	if (parseInt(edtusr)!=0) {
		edtspan = "<span class='edt_class'> ["+edt_bylan+" "+edtusr+"]</span>";
	}
	if(type == 'shout') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+escapeHtml(key)+"' data-ided="+escapeHtml(key)+">"+usravatar+"<span class='time_msgShout'><span>[</span>"+hour+"<span>]</span></span><span class='username_msgShout'>"+username+"</span>:<span class='content_msgShout' style='"+shoutstyle+"'>"+message+"</span>"+edtspan+"</div>");
	}
	if(type == 'system') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+escapeHtml(key)+"' data-ided="+escapeHtml(key)+">"+usravatar+"*<span class='username_msgShout'>"+username+"</span><span class='content_msgShout' style='"+shoutstyle+"'>"+message+"</span>"+edtspan+"*</div>");
	}
	if(cur==0) {
		if(parseInt(actaimg) && parseInt(loadimg)) {
			imgconv(count);
		}
		if (reqtype == 'lognext' || reqtype == 'logback') {
			if(direction!='top') {
				scrollrinlog();
			}
		}
		else {
			if(direction!='top') {
				scrollrin(key,scrollarea,ckold,count);
			}
		}
	}
}

function rinshoutbox_connect() {
	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (!sb_sty) {
		sb_sty = {};
	}
	if (!sb_sty['logoff']) {
		if(!$('#auto_log').length) {
			$('<div/>', { id: 'auto_log', class: 'top-right' }).appendTo('body');
		}
		setTimeout(function() {
			$('#auto_log').jGrowl(spinner+aloadlang, { theme:'jgrowl_success', sticky: true });
		},200);
		$.ajax({
			type: 'POST',
			url: 'xmlhttp.php?action=rinshoutbox_gettoken&my_post_key='+my_post_key
		}).done(function (result) {
			var IS_JSON = true;
			try {
				var json = $.parseJSON(result);
			}
			catch(err) {
				IS_JSON = false;
			}
			if (IS_JSON) {
				rsb_connect_token(JSON.parse(result).token, JSON.parse(result).data);
			}
			else {
				if(typeof result == 'object')
				{
					if(result.hasOwnProperty("errors"))
					{
						$.each(result.errors, function(i, message)
						{
							if(!$('#er_others').length) {
								$('<div/>', { id: 'er_others', class: 'top-right' }).appendTo('body');
							}
							setTimeout(function() {
								$('#er_others').jGrowl(message, { theme:'jgrowl_error', life: 1500 });
							},200);
						});
					}
					if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
				}
				else {
					return result;
				}
				if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
				rsb_connecticon();
			}
		});
	}
	else {
		rsb_connecticon();
	}
};

function rsb_connecticon() {

	if(!$('#rsb_connect').length) {
		but = '<a class="yuieditor-button" id="rsb_connect" title="'+connectlang+'"><div style="background-image: url('+rootpath+'/images/connect.png); opacity: 1; cursor: pointer;">'+connectlang+'</div></a>';
		$(but).appendTo('.yuieditor-group_shout_text:last');
	}
}

($.fn.on || $.fn.live).call($(document), 'click', '#rsb_connect', function (e) {
	e.preventDefault();
	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (!sb_sty) {
		sb_sty = {};
	}
	sb_sty['logoff'] = 0;
	localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
	rinshoutbox_connect();
});

function rsb_connect_token(token, data) {
	
	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (!sb_sty) {
		sb_sty = {};
	}
	if (sb_sty['badword'] === undefined || parseInt(sb_sty['badword_ver'])!=parseInt(data.badwordver)) {
		$.ajax({
			type: 'POST',
			url: 'xmlhttp.php?action=rinshoutbox_getbadword&my_post_key='+my_post_key
		}).done(function (result) {
			var IS_JSON = true;
			try {
				var json = $.parseJSON(result);
			}
			catch(err) {
				IS_JSON = false;
			}
			if (IS_JSON) {
				badwl = {};
				for (var val in JSON.parse(result).badwrdcache) {
					badwl[JSON.parse(result).badwrdcache[val].badword] = JSON.parse(result).badwrdcache[val].replacement;
				}
				sb_sty['badword'] = JSON.stringify(badwl);
				sb_sty['badword_ver'] = data.badwordver;
				localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
			}
			else {
				if(typeof result == 'object')
				{
					if(result.hasOwnProperty("errors"))
					{
						$.each(result.errors, function(i, message)
						{
							if(!$('#er_others').length) {
								$('<div/>', { id: 'er_others', class: 'top-right' }).appendTo('body');
							}
							setTimeout(function() {
								$('#er_others').jGrowl(message, { theme:'jgrowl_error', life: 1500 });
							},200);
						});
					}
				}
				else {
					return result;
				}
			}
		});		
	}

	var config = {
		apiKey: data.apikey,
		authDomain: data.authdomain,
		databaseURL: data.databaseurl
	};
	firebase.initializeApp(config);

	var called = false;

	firebase.auth().onAuthStateChanged(function(user) {
		// Once authenticated, instantiate Firechat with the logged in user
		if (user && !called) {
			if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
			conelem = document.getElementById("rsb_connect");
			if (conelem) { conelem.parentElement.removeChild(conelem); }
			rsbshout(user, data);
			called = true;
		}
	});

	firebase.auth().signInWithCustomToken(token).catch(function(error) {
		if (!called) {
			if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
			if(!$('#inv_alert').length) {
				$('<div/>', { id: 'inv_alert', class: 'top-right' }).appendTo('body');
			}
			setTimeout(function() {
				$('#inv_alert').jGrowl(invtoklang, { theme:'jgrowl_error', life: 1500 });
			},200);
			rsb_connecticon();
		}
	});
}

function rsbshout(authuser, authData) {
	var notban = '1',
	uidlist = sb_ign_lst = '',
	numshouts = authData.numshouts,
	mentsound = 0;

	if (parseInt(authData.numshouts)>100) {
		numshouts = '100';
	}

	var shoutbut = '<button id="sbut" style="margin: 2px; float: right;">'+shout_lang+'</button>';
	$(shoutbut).appendTo('.yuieditor-toolbar');

	if (parseInt(actcolor)) {
		sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
		if (sb_sty) {
			if (sb_sty['color']) {
				if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(sb_sty['color'])) {
					colorshout = sb_sty['color'];
				}
			}
		}
	}

	if (!parseInt(destyl)) {
		sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
		if (sb_sty) {
			if (sb_sty['font']) {
				fontype = sb_sty['font'];
			}
			if (sb_sty['size']) {
				fontsize = sb_sty['size'];
			}
		}
	}

	if (parseInt(actbold)) {
		sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
		if (sb_sty) {
			if (sb_sty['bold']) {
				fontbold = sb_sty['bold'];
			}
		}
	}

	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (sb_sty) {
		if (sb_sty['sound']) {
			shoutvol = sb_sty['sound'];
		}
		if (sb_sty['mentsound']) {
			mentsound = sb_sty['mentsound'];
		}
		if (sb_sty['loadimg']) {
			loadimg = sb_sty['loadimg'];
		}
	}

	sb_ign = JSON.parse(localStorage.getItem('sb_ign_lst'));
	if (sb_ign) {
		if (sb_ign['list']) {
			sb_ign_lst = sb_ign['list'];
		}
	}
	
	sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
	if (!sb_sty) {
		sb_sty = {};
	}
	if (!sb_sty['badword']) {
		badwl = {};
	}
	else {
		badwl = JSON.parse(sb_sty['badword']);
	}

	var amOnline = firebase.database().ref(".info/connected"),
	userRef = firebase.database().ref('onlist/'+authuser.uid+''),
	simplelist = firebase.database().ref('onlist2/'+authuser.uid+''),
	presimplelist = firebase.database().ref('onlist2/'),
	onlist = firebase.database().ref('onlist'),
	bmlfb = firebase.database().ref('bml/U'+authuser.uid+''),
	prebmlfb = firebase.database().ref('bml/'),
	flolfb = firebase.database().ref('flol/'+authuser.uid+''),
	numusr = '';
	amOnline.on('value', function(snapshot) {
		if (snapshot.val()) {
			sluid = parseInt(authuser.uid);
			userRef.onDisconnect().remove();
			simplelist.onDisconnect().update({status: '0'});
			userRef.set({name: ''+authData.user+'', id: ''+authuser.uid+''});
			bmlfb.once("value", function(snapshot) {
				if (!snapshot.val()) {
					bmlfb.set({nicks: ''+authData.user+'', ban: 0, uid: ''+authuser.uid+''});
				}
				else {
					if (parseInt(snapshot.val().ban)==1) {
						notban = 0;
					}
				}
			});
			simplelist.update({status: '1'});
			onlist.on('value', function(snapshot) {
				if (snapshot.val()) {
					numusr = snapshot.numChildren();
					$('.actusr').text(''+usractlan+' '+numusr+'');
				}
			});
		}
	});

	bmlfb.on("child_changed", function(snapshot) {
		if (parseInt(snapshot.val())==1) {
			notban = 0;
			if(!$('#upd_alert').length) {
				$('<div/>', { id: 'upd_alert', class: 'top-right' }).appendTo('body');
			}
			setTimeout(function() {
				$('#upd_alert').jGrowl(usr_banlang, { theme:'jgrowl_error', life: 1500 });
			},200);
		}
		else {
			notban = 1;
		}
	});

	presimplelist.once("value", function(snapshot) {
		uidlist = snapshot.val();
	});

	presimplelist.on("child_changed", function(snapshot) {
		var key = snapshot.key,
		uidlistupd = snapshot.val().status;

		if (uidlistupd==1){
			$("[data-uid="+key+"]").find(".time_msgShout span").css("color",on_color);
		}
		else {
			$("[data-uid="+key+"]").find(".time_msgShout span").css("color","");
		}
	});

	var noticefb = firebase.database().ref("notice");

	noticefb.once('value', function(snapshot) {
		if (snapshot.val()) {
			var textnot = snapshot.val().not;
			if (textnot) {
				$(".notshow").text(escapeHtml(textnot));
			}
		}
	});

	noticefb.on("child_changed", function(snapshot) {
		if (snapshot.val()) {
			var textnot = snapshot.val();
			if (textnot) {
				$(".notshow").text(escapeHtml(textnot));
			}
			else {
				$(".notshow").text('');
			}
		}
		else {
			$(".notshow").text('');
		}
	});

	noticefb.on("child_added", function(snapshot) {
		if (snapshot.val()) {
			var textnot = snapshot.val();
			if (textnot) {
				$(".notshow").text(escapeHtml(textnot));
			}
			else {
				$(".notshow").text('');
			}
		}
		else {
			$(".notshow").text('');
		}
	});

	var last_check = (Date.now()/1000) - authData.floodtime,
	messagesRef = firebase.database().ref("shout");

	messagesRef.on("child_removed", function(snapshot) {
		var key = snapshot.key;
		$('div.wrapShout').children('div.'+key+'').remove();
	});

	$('#shout_text').keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			onshout(e);
		}
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#sbut', function (e) {
		e.preventDefault();
		onshout(e);
	});

	function onshout(e) {
		current = Date.now()/1000;
		time_passed = current - last_check;
		if (parseInt(time_passed) >= authData.floodtime) {
			last_check = current;
			if (notban) {
				if ($('#shout_text').attr('data-type')=='shout') {

					var msg = escapeHtml($('#shout_text').val());

					if (parseInt(authData.lc) > 0) {
						msg = msg.slice(0, parseInt(authData.lc));
					}

					if(msg == '' || msg == null) {
						$('#shout_text').val('').focus();
						return false;
					}
					else {
						$('#shout_text').val('').focus();
						if ( /^\/me[\s]+(.*)$/.test(msg) ) {
							messagesRef.push({msg: badwordreplace(msg.slice(4),badwl), uid: authuser.uid, colorsht: colorshout, bold: fontbold, font: fontype, size: fontsize, avatar: authData.avatar, nick: authData.user, edt: '0', edtusr: '0', type: 'system', created: firebase.database.ServerValue.TIMESTAMP});
							flolfb.set({created: firebase.database.ServerValue.TIMESTAMP});
						}
						else {
							messagesRef.push({msg: badwordreplace(msg,badwl), uid: authuser.uid, colorsht: colorshout, bold: fontbold, font: fontype, size: fontsize, avatar: authData.avatar, nick: authData.user, edt: '0', edtusr: '0', type: 'shout', created: firebase.database.ServerValue.TIMESTAMP});
							flolfb.set({created: firebase.database.ServerValue.TIMESTAMP});
						}
						return false;
					}
				}
				else if ($('#shout_text').attr('data-type')=='edit') {
					var edmsg = escapeHtml($('#shout_text').val());

					if (parseInt(authData.lc) > 0) {
						edmsg = edmsg.slice(0, parseInt(authData.lc));
					}

					if(edmsg == '' || edmsg == null){
						if(!$('#upd_alert').length) {
							$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
						}
						setTimeout(function() {
							$('#upd_alert').jGrowl(mes_emptylan, { theme:'jgrowl_error', life: 500 });
						},200);
						$('#shout_text').val('').focus();
						return false;
					}
					else {
						$('#shout_text').val('').focus();
						$('#shout_text').attr("data-type", "shout");
						$('#cancel_edit').remove();
						$('#del_shout').remove();
						var id = $('#shout_text').attr('data-id');
						refedt = firebase.database().ref("shout/"+id+"");
						refedt.update({msg: badwordreplace(edmsg,badwl), edt: '1', edtusr: authData.username});
						return false;
					}
				}
			}
			else {
				$('#shout_text').val('').focus();
				if(!$('#upd_alert').length) {
					$('<div/>', { id: 'upd_alert', class: 'top-right' }).appendTo('body');
				}
				setTimeout(function() {
					$('#upd_alert').jGrowl(usr_banlang, { theme:'jgrowl_error', life: 1500 });
				},200);
				e.preventDefault();
				return;
			}
		}
		else {
			if(!$('#upd_alert').length) {
				$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
			}
			setTimeout(function() {
				time_after = authData.floodtime - parseInt(time_passed);
				$('#upd_alert').jGrowl(flood_msglan+time_after+secounds_msglan, { theme:'jgrowl_process', life: 500 });
			},50);
			e.preventDefault();
			return;
		}
	}

	function displayMsg(reqtype, message, username, uid, colorsht, font, size, bold, avatar, edt, edtusr, type, key, created, ckold, cur){
		var hour = moment(created).utcOffset(parseInt(zoneset)).format(zoneformt);
		message = regexrin(escapeHtml(revescapeHtml(message))),
		nums = numshouts;
		if (reqtype=='lognext' || reqtype=='logback') {
			if (parseInt(authData.mpp)>200) {
				nums = '200';
			}
			else {
				nums = authData.mpp;
			}
		}

		if (sb_ign_lst) {
			if ($.inArray(parseInt(uid), sb_ign_lst.split(',').map(function(ignlist){return Number(ignlist);}))!=-1) {
				message = ign_msglan;
			}
		}

		shoutgenerator(reqtype,key,colorsht,font,size,bold,avatar,hour,username,message,type,ckold,direction,nums,cur,edtusr);
		if (parseInt(uidlist[uid].status)==1) {
			$("[data-uid="+uid+"]").find(".time_msgShout span").css("color",on_color);
		}
		if (regexment(message,authData.mybbusername)) {
			if(parseFloat(shoutvol) && parseInt(mentsound) && ckold=="new") {
				var sound = new Audio(rootpath + '/jscripts/rin/shoutbox/rsb_sound.mp3');
				sound.volume = parseFloat(shoutvol);
				sound.play();
			}
			$("div."+key+"").css("border-left",ment_borderstyle).attr( "data-ment", "yes" );
			setTimeout(function() {
				if ($('.shoutarea').children("[data-ment=yes]").length) {
					document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
				}
			},200);
		}
		if (edt=='1') {
			$("div."+key+"").css("background-color",edt_color);
		}
	};

	function checkMsg(req, msg, nick, uid, colorsht, font, size, bold, avatar, edt, edtusr, type, _id, created, ckold, cur) {
		var mtype = 'shout';

		if (req=='lognext' || req=='logback') {
			mtype = req;
		}
		displayMsg(mtype, msg, nick, uid, colorsht, font, size, bold, avatar, edt, edtusr, type, _id, created, ckold, cur);
	};

	function newmsg (snapshot,id) {
		docs = snapshot.val();
		key = snapshot.key;
		if (key!=id) {
			if(parseFloat(shoutvol) && !parseInt(mentsound)) {
				var sound = new Audio(rootpath + '/jscripts/rin/shoutbox/rsb_sound.mp3');
				sound.volume = parseFloat(shoutvol);
				sound.play();
			}
			checkMsg("msg", docs.msg, docs.nick, docs.uid, docs.colorsht, docs.font, docs.size, docs.bold, docs.avatar, docs.edt, docs.edtusr, docs.type, snapshot.key, docs.created, 'new', 0);
		}
	}

	messagesRef.orderByKey().limitToLast(parseInt(numshouts)).once('value', function (snapshot) {
		if (snapshot.val()) {
			var predocs = $.map(snapshot.val(), function(value, index) {
				value._id = index;
				return [value];
			});
			docs = predocs.reverse();
			for (var i = docs.length-1; i >= 0; i--) {
				checkMsg("msg", docs[i].msg, docs[i].nick, docs[i].uid, docs[i].colorsht, docs[i].font, docs[i].size, docs[i].bold, docs[i].avatar, docs[i].edt, docs[i].edtusr, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
			}
			var start = docs[0]._id;
			messagesRef.orderByKey().startAt(start).on("child_added", function(snapshot) {
				if(snapshot.val()) {
					newmsg(snapshot,start);
				}
			});
		}
		else {
			messagesRef.orderByKey().on("child_added", function(snapshot) {
				if(snapshot.val()) {
					newmsg(snapshot,'0');
				}
			});
		}
	});

	function updmsg(message, key, edt, edtusr) {
		message = regexrin(escapeHtml(revescapeHtml(message)));
		setTimeout(function() {
			if(parseInt(actaimg) && parseInt(loadimg)) {
				imgconv(count);
			}
			if ($('.shoutarea').children().hasClass(key)) {
				if(direction!='top') {
					scrollrin(key,'.shoutarea','new','msgstcount');
				}
			}
		},50);
		var menttest = regexment(message,authData.mybbusername);
		if ($("div."+key+"").attr('data-ment') == "yes") {
			if(!menttest) {
				$("div."+key+"").css("border-left","").attr( "data-ment", "no" );
				setTimeout(function() {
					if ($('.shoutarea').children("[data-ment=yes]").length) {
						document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
					}
					else {
						document.title = orgtit;
					}
				},200);
			}
		}
		if (menttest) {
			if(parseInt(mentsound)) {
				var sound = new Audio(rootpath + '/jscripts/rin/shoutbox/rsb_sound.mp3');
				sound.volume = parseFloat(shoutvol);
				sound.play();
			}
			$("div."+key+"").css("border-left",ment_borderstyle).attr( "data-ment", "yes" );
			setTimeout(function() {
				document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
			},200);
		}
		$('div.'+key+'').children('.content_msgShout').html(message);
		if (edt=='1') {
			if ($('div.'+key+'').has('.edt_class').length) {
				$('div.'+key+'').children('.edt_class').html("<span class='edt_class'> ["+edt_bylan+" "+edtusr+"]</span>");
			}
			else {
				$('div.'+key+'').children('.content_msgShout').after("<span class='edt_class'> ["+edt_bylan+" "+edtusr+"]</span>");
			}
			$("div."+key+"").css("background-color",edt_color);
		}
	}

	messagesRef.on("child_changed", function(snapshot) {
		data = snapshot.val();
		if (data) {
			var key = snapshot.key;
			updmsg(data.msg, key, data.edt, data.edtusr);
		}
	});

	function logfunc() {
		numslogs = '';
		if (parseInt(authData.mpp)>200) {
			numslogs = '200';
		}
		else {
			numslogs = authData.mpp;
		}
		messagesRef.orderByKey().limitToLast(parseInt(numslogs)).once('value', function (snapshot) {
			if (snapshot.val()) {
				var predocs = $.map(snapshot.val(), function(value, index) {
					value._id = index;
					return [value];
				});
				docs = predocs.reverse();
				for (var i = docs.length-1; i >= 0; i--) {
					checkMsg("lognext", docs[i].msg, docs[i].nick, docs[i].uid, docs[i].colorsht, docs[i].font, docs[i].size, docs[i].bold, docs[i].avatar, docs[i].edt, docs[i].edtusr, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
				}
			}
		});
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#log', function (e) {
		var heightwin = window.innerHeight*0.8,
		widthwin = window.innerWidth*0.5,
		page = '',
		initpage = '',
		npostbase = '';

		if (window.innerWidth < 650 || (window.innerWidth < window.innerHeight)) {
			 widthwin = document.getElementById("rshout_e").offsetWidth;
		}
		if (window.innerWidth < window.innerHeight) {
			heightwin = widthwin*0.8;
		}

		function displayfpglogMsg(data){
			numslogs = '';
			if (parseInt(authData.mpp)>200) {
				numslogs = '200';
			}
			else {
				numslogs = authData.mpp;
			}
			npostbase = data;
			pagebase = Math.ceil(npostbase/numslogs);
			npost = npostbase + pagebase;
			page = Math.ceil(npost/numslogs);
			if (page>1) {
				initpage = "1/"+page;
			}
			else {
				initpage = "1/1";
			}

			$('body').append( '<div id="logpop" style="width: '+widthwin+'px;max-width:900px !important"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+log_shoutlan+'</strong></div></td></tr><tr><td class="trow1" colspan="2"><div class="logstyle" style="overflow-y: auto;width:99%;height: '+heightwin*0.7+'px;word-break:break-all"><div class="loglist"></div></div></td></tr><td class="trow1"><div id="page" style="text-align:center"><button id="page_back" style="margin:4px;">'+log_backlan+'</button> <span id="pagecount" data-pageact="1" data-pagemax="'+page+'">'+initpage+'</span> <button id="page_next" style="margin:4px;">'+log_nextlan+'</button></div></td></table></div></div>' );
			$('#logpop').modal({ zIndex: 7 });
			logfunc();
		}

		messagesRef.once('value', function(dataSnapshot) {
			displayfpglogMsg(dataSnapshot.numChildren());
		});
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#page_next', function (e) {
		e.preventDefault();
		var actpage = $('#pagecount').attr('data-pageact'),
		maxpage = $('#pagecount').attr('data-pagemax');

		if (parseInt(actpage)==parseInt(maxpage)) {
			return;
		}
		else {
			var newactpage = parseInt(actpage) + 1,
			newpagelist = newactpage+"/"+maxpage,
			prevpagefirstid = '';
			if(direction=='top'){
				prevpagefirstid = $(".msglog:last").attr('data-ided');
			}
			else {
				prevpagefirstid = $(".msglog:first").attr('data-ided');
			}
			$('#pagecount').text(newpagelist);
			$('.loglist').remove();
			$(".logstyle").append('<div class="loglist"></div>');
			$('#pagecount').attr('data-pageact', newactpage);
			$('#pagecount').val(newpagelist);

			numslogs = '';
			if (parseInt(authData.mpp)>200) {
				numslogs = '200';
			}
			else {
				numslogs = authData.mpp;
			}
			messagesRef.orderByKey().endAt(prevpagefirstid).limitToLast(parseInt(numslogs)).once('value', function (snapshot) {
				if (snapshot.val()) {
					var predocs = $.map(snapshot.val(), function(value, index) {
						value._id = index;
						return [value];
					});
					docs = predocs.reverse();
					for (var i = docs.length-1; i >= 0; i--) {
						checkMsg("lognext", docs[i].msg, docs[i].nick, docs[i].uid, docs[i].colorsht, docs[i].font, docs[i].size, docs[i].bold, docs[i].avatar, docs[i].edt, docs[i].edtusr, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
					}
				}
			});
		}
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#page_back', function (e) {
		e.preventDefault();
		var actpage = $('#pagecount').attr('data-pageact'),
		maxpage = $('#pagecount').attr('data-pagemax');

		if (parseInt(actpage)==1) {
			return;
		}
		else {
			var newactpage = parseInt(actpage) - 1,
			newpagelist = newactpage+"/"+maxpage,
			prevpagelastid = '';
			if(direction=='top'){
				prevpagelastid = $(".msglog:first").attr('data-ided');
			}
			else {
				prevpagelastid = $(".msglog:last").attr('data-ided');
			}
			$('#pagecount').text(newpagelist);
			$('.loglist').remove();
			$(".logstyle").append('<div class="loglist"></div>');
			$('#pagecount').attr('data-pageact', newactpage);
			$('#pagecount').val(newpagelist);

			numslogs = '';
			if (parseInt(authData.mpp)>200) {
				numslogs = '200';
			}
			else {
				numslogs = authData.mpp;
			}
			messagesRef.orderByKey().startAt(prevpagelastid).limitToFirst(parseInt(numslogs)).once('value', function (snapshot) {
				if (snapshot.val()) {
					var predocs = $.map(snapshot.val(), function(value, index) {
						value._id = index;
						return [value];
					});
					docs = predocs.reverse();
					for (var i = docs.length-1; i >= 0; i--) {
						checkMsg("lognext", docs[i].msg, docs[i].nick, docs[i].uid, docs[i].colorsht, docs[i].font, docs[i].size, docs[i].bold, docs[i].avatar, docs[i].edt, docs[i].edtusr, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
					}
				}
			});
		}
	});

	($.fn.on || $.fn.live).call($(document), 'dblclick', '.msgShout', function (e) {
		var id = $(this).attr('data-ided');
		function edtfunc(msg, uid){
			msg = revescapeHtml(msg);
			if ((uid == authuser.uid && parseInt(authData.rsbedg)) || parseInt(authData.rsbmod)) {
				$('#shout_text').attr( {"data-type": "edit", "data-id": id} );
				$('#shout_text').val(msg);
				if(!$('#cancel_edit').length) {
					$('#rsb-form').append('<button id="cancel_edit" style="margin:4px;">'+cancel_editlan+'</button><button id="del_shout" style="margin:4px;" data-delid='+id+'>'+shout_delan+'</button>');
				}
			}
			else {
				if(!$('#upd_alert').length) {
					$('<div/>', { id: 'upd_alert', class: 'bottom-right' }).appendTo('body');
				}
				setTimeout(function() {
					$('#upd_alert').jGrowl(perm_msglan, { theme:'jgrowl_error', life: 500 });
				},200);
			}
		}

		refedt = firebase.database().ref("shout/"+id+"");
		refedt.once('value', function(dataSnapshot) {
			edtfunc(dataSnapshot.val().msg, dataSnapshot.val().uid);
		});
	});

	if (parseInt(authData.rsbmod)) {
		function prunefunc() {
			heightwin = 120;
			$('body').append( '<div class="prune"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+prune_shoutlan+':</strong></div></td></tr><td class="trow1">'+conf_questlan+'</td></table></div><td><button id="prune_yes" style="margin:4px;">'+shout_yeslan+'</button><button id="no_ans" style="margin:4px;">'+shout_nolan+'</button></td></div>' );
			$('.prune').modal({ zIndex: 7 });
		}

		function buildbanl(nicks,uid,ban,i) {
			$("#banlselector").append('<option value="'+parseInt(uid)+'" data-i="'+parseInt(i)+'" data-ban="'+parseInt(ban)+'">'+nicks+'</option>');
		}

		function banusr(snapshot) {
			heightwin = 200;
			$('body').append( '<div class="banlist"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+ban_syslan+':</strong></div></td></tr><tr><td class="tcat">'+ban_msglan+':</td></tr><tr><td id="banlist" class="trow1"></td></tr><tr><td class="trow1"><select id="banlselector" style="width:100%"></select></td></tr></table></div><td><button id="banunbutton" style="margin:4px;">'+ban_unban_lan+'</button></td></div>' );
			if(!(snapshot.val() instanceof Array)) {
				docs = $.map(snapshot.val(), function(value, index) {
					return [value];
				});
				for (var i = docs.length-1; i >= 0; i--) {
					buildbanl(docs[i].nicks, parseInt(docs[i].uid), parseInt(docs[i].ban), i);
				}
			}

			$("[data-ban=1]").each(function(){
				$("#banlist").append('<span class="banusr" data-uid="'+$(this).val()+'">'+$(this).html()+'</span>, ');
			});
			var onowlist = $('#banlist').html();
			if (onowlist) {
				$('#banlist').html(onowlist.slice(0, -2));
			}
			else {
				$("#banlist").text(no_ban_usrlan);
			}
			$("#banlselector").select2();
			$('.banlist').modal({ zIndex: 7 });
		}

		($.fn.on || $.fn.live).call($(document), 'click', '.banusr', function (e) {
			e.preventDefault();
			var uid = $(this).attr('data-uid');
			$("#banlselector").select2("val", uid);
		});

		($.fn.on || $.fn.live).call($(document), 'click', '#banunbutton', function (e) {
			e.preventDefault();
			if ($('#banlselector option:selected').val()!=null) {
				uid = $('#banlselector option:selected').val();
				if (parseInt(uid)==parseInt(authuser.uid)) {
					if(!$('#banyourself').length) {
						$('<div/>', { id: 'banyourself', class: 'top-right' }).appendTo('body');
					}
					setTimeout(function() {
						$('#banyourself').jGrowl(ban_selflan, { theme:'jgrowl_error', life: 1500 });
					},200);
				}
				else {
					prebmlfb.child('U'+uid+'').once("value", function(snapshot) {
						if (snapshot.val()) {
							if (parseInt(snapshot.val().ban)==1) {
								prebmlfb.child('U'+uid+'').update({ban: 0});
							}
							else {
								prebmlfb.child('U'+uid+'').update({ban: 1});
							}
						}
					});
					messagesRef.push({msg: banlist_modmsglan, uid: authuser.uid, colorsht: colorshout, bold: fontbold, font: fontype, size: fontsize, avatar: authData.avatar, nick: authData.user, edt: '0', edtusr: '0', type: 'system', created: firebase.database.ServerValue.TIMESTAMP});
				}
			}
			$.modal.close();
		});

		function noticefunc(notice) {
			heightwin = 120;
			$('body').append( '<div class="noticemod"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+not_msglan+':</strong></div></td></tr><td class="trow1"><textarea id="noticetext" style="width:97%;height: '+heightwin*0.3+'px;" >'+notice+'</textarea></td></table></div><td><button id="sv_notice" style="margin:4px;">'+shout_savelan+'</button></td></div>' );
			$('.noticemod').modal({ zIndex: 7 });
		}

		banbut = '<a class="yuieditor-button" id="banusr" title="'+ban_syslan+'"><div style="background-image: url('+rootpath+'/images/buddy_delete.png); opacity: 1; cursor: pointer;">'+ban_syslan+'</div></a>';
		$(banbut).appendTo('.yuieditor-group_shout_text:last');

		($.fn.on || $.fn.live).call($(document), 'click', '#banusr', function (e) {
			prebmlfb.once("value", function(snapshot) {
				banusr(snapshot);
			});
		});

		notice = '<a class="yuieditor-button" id="notice" title="'+not_msglan+'"><div style="background-image: url('+rootpath+'/images/icons/information.png); opacity: 1; cursor: pointer;">'+not_msglan+'</div></a>';
		$(notice).appendTo('.yuieditor-group_shout_text:last');

		($.fn.on || $.fn.live).call($(document), 'click', '#notice', function (e) {
			noticefb.once('value', function(dataSnapshot) {
				var notice = '';
				if (dataSnapshot.val()) {
					notice = escapeHtml(dataSnapshot.val().not);
				}
				noticefunc(notice);
			});
		});

		prune = '<a class="yuieditor-button" id="prune" title="'+prune_msglan+'"><div style="background-image: url('+rootpath+'/images/invalid.png); opacity: 1; cursor: pointer;">'+prune_msglan+'</div></a>';
		$(prune).appendTo('.yuieditor-group_shout_text:last');

		($.fn.on || $.fn.live).call($(document), 'click', '#prune', function (e) {
			prunefunc();
		});

		($.fn.on || $.fn.live).call($(document), 'click', '#sv_notice', function (e) {
			e.preventDefault();
			var textnot = escapeHtml($('#noticetext').val());
			noticefb.set({not: textnot});
			messagesRef.push({msg: not_modmsglan, uid: authuser.uid, colorsht: colorshout, bold: fontbold, font: fontype, size: fontsize, avatar: authData.avatar, nick: authData.user, edt: '0', edtusr: '0', type: 'system', created: firebase.database.ServerValue.TIMESTAMP});
			$.modal.close();
		});

		($.fn.on || $.fn.live).call($(document), 'click', '#prune_yes', function (e) {
			e.preventDefault();
			messagesRef.orderByKey().once('value', function (snapshot) {
				if (snapshot.val()) {
					docs = $.map(snapshot.val(), function(value, index) {
						return [index];
					});
					for (var i = docs.length-1; i >= 0; i--) {
						messagesRef.child(docs[i]).remove();
					}
				}
			});
			setTimeout(function() {
				messagesRef.push({msg: shout_prunedmsglan, uid: authuser.uid, colorsht: colorshout, bold: fontbold, font: fontype, size: fontsize, avatar: authData.avatar, nick: authData.user, edt: '0', edtusr: '0', type: 'system', created: firebase.database.ServerValue.TIMESTAMP});
			},50);
			$.modal.close();
		});
	}

	($.fn.on || $.fn.live).call($(document), 'click', '#del_shout', function (e) {
		e.preventDefault();
		var id = $(this).attr('data-delid'),
		heightwin = 120;
		$('body').append( '<div class="del"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+del_msglan+':</strong></div></td></tr><td class="trow1">'+conf_questlan+'</td></table></div><td><button id="del_yes" style="margin:4px;" ided="'+id+'">'+shout_yeslan+'</button><button id="del_no" style="margin:4px;">'+shout_nolan+'</button></td></div>' );
		$('.del').modal({ zIndex: 7 });
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#del_yes', function (e) {
		e.preventDefault();
		var id = $(this).attr('ided');
		refedt = firebase.database().ref("shout/"+id+"");
		refedt.remove();
		$('#shout_text').val('').focus();
		$('#shout_text').attr("data-type", "shout");
		$('#cancel_edit').remove();
		$('#del_shout').remove();
		$.modal.close();
	});

	messagesRef.on("child_removed", function(snapshot) {
		if (snapshot) {
			$('div.wrapShout').children('div.'+snapshot.key+'').remove();
			setTimeout(function() {
				if ($('.shoutarea').children("[data-ment=yes]").length) {
					document.title = '('+$('.shoutarea').children("[data-ment=yes]").length+') '+orgtit+'';
				}
				else {
					document.title = orgtit;
				}
			},200);
		}
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#del_no', function (e) {
		e.preventDefault();
		$('#shout_text').val('').focus();
		$('#shout_text').attr("data-type", "shout");
		$('#cancel_edit').remove();
		$('#del_shout').remove();
		$.modal.close();
	});

	function settingsfunc() {
		heightwin = 170;
		checked = imgload_span = checkedimg = '';
		if (mentsound) {
			checked = 'checked';
		}
		if (parseInt(actaimg)) {
			if (loadimg) {
				checkedimg = 'checked';
			}
			imgload_span = '<tr><td class="trow1"><input type="checkbox" id="imgloadopt" '+checkedimg+'>'+loadimg_lan+'</td></tr>';
		}
		$('body').append( '<div class="settings"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+settings_lan+'</strong></div></td></tr>'+imgload_span+'<tr><td class="tcat">'+volume_lan+':</td></tr><tr><td class="trow1" style="text-align:center;">'+min_lan+'<input id="s_volume" type="range" min="0" max="1" step="0.05" value="'+parseFloat(shoutvol)+'"/>'+max_lan+'</td></tr><tr><td class="trow1"><input type="checkbox" id="mentsound" '+checked+'>'+ment_sound+'</td></tr></table></div><td></div>' );
		var soundinput = document.getElementById("s_volume");
		soundinput.addEventListener("input", function() {
			var sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
			if (!sb_sty) {
				sb_sty = {};
			}
			sb_sty['sound'] = soundinput.value;
			localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
			shoutvol = parseFloat(soundinput.value);
		}, false);
		var loadimginput = document.getElementById("imgloadopt");
		if (loadimginput) {
			loadimginput.addEventListener("change", function() {
				var sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
				if (!sb_sty) {
					sb_sty = {};
				}
				if (loadimginput.checked) {
					sb_sty['loadimg'] = 1;
					loadimg = 1;
				} 
				else {
					sb_sty['loadimg'] = 0;
					loadimg = 0;
				}
				localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
			}, false);	
		}
		var mentsoundinput = document.getElementById("mentsound");
		mentsoundinput.addEventListener("change", function() {
			var sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
			if (!sb_sty) {
				sb_sty = {};
			}
			if (mentsoundinput.checked) {
				sb_sty['mentsound'] = 1;
				mentsound = 1;
			} 
			else {
				sb_sty['mentsound'] = 0;
				mentsound = 0;
			}
			localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
		}, false);
		$('.settings').modal({ zIndex: 7 });
	}

	settings = '<a class="yuieditor-button" id="settings" title="'+settings_lan+'"><div style="background-image: url('+rootpath+'/images/settings.png); opacity: 1; cursor: pointer;">'+settings_lan+'</div></a>';
	$(settings).appendTo('.yuieditor-group_shout_text:last');

	($.fn.on || $.fn.live).call($(document), 'click', '#settings', function (e) {
		settingsfunc();
	});

	function ignusr(list) {
		heightwin = 120;
		$('body').append( '<div class="ignlist"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+ign_titlan+':</strong></div></td></tr><td class="trow1"><textarea id="ign_list" style="width:97%;height: '+heightwin*0.3+'px;" >'+list+'</textarea></td></table></div><td><button id="sv_ignlist" style="margin:4px;">'+shout_savelan+'</button></td></div>' );
		$('.ignlist').modal({ zIndex: 7 });
	}

	ignbut = '<a class="yuieditor-button" id="ignusr" title="'+ign_titlan+'"><div style="background-image: url('+rootpath+'/images/ignore.png); opacity: 1; cursor: pointer;">'+ign_titlan+'</div></a>';
	$(ignbut).appendTo('.yuieditor-group_shout_text:last');

	($.fn.on || $.fn.live).call($(document), 'click', '#ignusr', function (e) {
		ignusr(sb_ign_lst);
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#sv_ignlist', function (e) {
		e.preventDefault();
		var newlist = escapeHtml($('#ign_list').val());
		var sb_ign = JSON.parse(localStorage.getItem('sb_ign_lst'));
		if (!sb_ign) {
			sb_ign = {};
		}
		sb_ign['list'] = newlist;
		localStorage.setItem('sb_ign_lst', JSON.stringify(sb_ign));
		sb_ign_lst = newlist;
		$.modal.close();
	});

	log = '<a class="yuieditor-button" id="log" title="'+log_msglan+'"><div style="background-image: url('+rootpath+'/images/log.png); opacity: 1; cursor: pointer;">'+log_msglan+'</div></a>';
	$(log).appendTo('.yuieditor-group_shout_text:last');

	function logofffunc() {
		heightwin = 120;
		$('body').append( '<div class="logoff"><div style="overflow-y: auto;max-height: '+heightwin+'px !important; "><table cellspacing="'+theme_borderwidth+'" cellpadding="'+theme_tablespace+'" class="tborder"><tr><td class="thead" colspan="2"><div><strong>'+logofflang+':</strong></div></td></tr><td class="trow1">'+conf_questlan+'</td></table></div><td><button id="logoff_yes" style="margin:4px;">'+shout_yeslan+'</button><button id="no_ans" style="margin:4px;">'+shout_nolan+'</button></td></div>' );
		$('.logoff').modal({ zIndex: 7 });
	}

	logoff = '<a class="yuieditor-button" id="logoff" title="'+logofflang+'"><div style="background-image: url('+rootpath+'/images/logoff.png); opacity: 1; cursor: pointer;">'+logofflang+'</div></a>';
	$(logoff).appendTo('.yuieditor-group_shout_text:last');

	($.fn.on || $.fn.live).call($(document), 'click', '#logoff', function (e) {
		logofffunc();
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#logoff_yes', function (e) {
		e.preventDefault();
		sb_sty = JSON.parse(localStorage.getItem('sb_col_ft'));
		if (!sb_sty) {
			sb_sty = {};
		}
		sb_sty['logoff'] = 1;
		localStorage.setItem('sb_col_ft', JSON.stringify(sb_sty));
		location.reload();
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#no_ans', function (e) {
		e.preventDefault();
		$.modal.close();
	});

	($.fn.on || $.fn.live).call($(document), 'click', '#cancel_edit', function (e) {
		e.preventDefault();
		$('#shout_text').val('').focus();
		$('#shout_text').attr("data-type", "shout");
		$('#cancel_edit').remove();
		$('#del_shout').remove();
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.shouttab', function (e) {
		e.preventDefault();
		$(".tabShout").removeClass( "selected" );
		$(".shouttab").addClass( "selected" );
		$('.wrapShout').hide();
		$('.shoutarea').show();
			if(direction!='top'){
				$(".shoutarea").animate({
					scrollTop: ($(".shoutarea")[0].scrollHeight)
				}, 10);
			}
		$('#shout_text').attr("data-type", "shout");
	});

	($.fn.on || $.fn.live).call($(document), 'click', '.actusr', function (e) {
		e.preventDefault();
		$(".tabShout").removeClass( "selected" );
		$(".actusr").addClass( "selected" );
		$('.numusr').html('<div id="onnow"></div>');
		onlist.on("child_added", function(snapshot) {
			var username = snapshot.val().name,
			id = snapshot.val().id;
			if (parseInt(dcusrname)) {
				username = username.replace(/(<([^>]+)>)/ig,"");
			}
			$("#onnow").prepend('<span class="usron" data-uid="'+id+'">'+username+'</span>, ');
		});
		var onowlist = $('#onnow').html();
		if (onowlist) {
			$('#onnow').html(onowlist.slice(0, -2));
		};
		$('.wrapShout').hide();
		$('.numusr').show();
	});
}