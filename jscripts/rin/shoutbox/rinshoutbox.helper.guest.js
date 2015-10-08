/**
 * Rin Shoutbox
 * https://github.com/martec
 *
 * Copyright (C) 2015-2015, Martec
 *
 * Rin Shoutbox is licensed under the GPL Version 3, 29 June 2007 license:
 *	http://www.gnu.org/copyleft/gpl.html
 *
 * @fileoverview Rin Shoutbox - Firebase Shoutbox for Mybb
 * @author Martec
 * @requires jQuery, Firebase, Mybb
 * @credits sound file by http://community.mybb.com/user-70405.html
 */
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
	return message;
}

function imgconv(key) {
	$("div."+key+"").find( "a[href*='.jpg'], a[href*='.gif'], a[href*='.png']" ).each(function(e) {
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

function shoutgenerator(reqtype,key,colorsht,font,size,bold,avatar,hour,username,message,type,ckold,direction,numshouts,cur) {
	var preapp = area = scrollarea = count = usravatar = shoutstyle = '';
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
	if(type == 'shout') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+escapeHtml(key)+"' data-ided="+escapeHtml(key)+">"+usravatar+"<span class='time_msgShout'><span>[</span>"+hour+"<span>]</span></span><span class='username_msgShout'>"+username+"</span>:<span class='content_msgShout' style='"+shoutstyle+"'>"+message+"</span></div>");
	}
	if(type == 'system') {
		$(""+area+"")[preapp]("<div class='msgShout "+count+" "+escapeHtml(key)+"' data-ided="+escapeHtml(key)+">"+usravatar+"*<span class='username_msgShout'>"+username+"</span><span class='content_msgShout' style='"+shoutstyle+"'>"+message+"</span>*</div>");
	}
	if(cur==0) {
		if(parseInt(actaimg)) {
			imgconv(count);
		}
		if(direction!='top') {
			scrollrin(key,scrollarea,ckold,count);
		}
	}
}

function rinshoutbox_connect() {
	if(!$('#auto_log').length) {
		$('<div/>', { id: 'auto_log', class: 'top-right' }).appendTo('body');
	}
	setTimeout(function() {
		$('#auto_log').jGrowl(spinner+aloadlang, { sticky: true });
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
			rsb_connect_token(JSON.parse(result).token, JSON.parse(result).url);
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
							$('#er_others').jGrowl(message, { life: 1500 });
						},200);
					});
				}
				if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
			}
			else {
				return result;
			}
			if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
		}
	});
};

function rsb_connect_token(token, url) {
	var ref = new Firebase(url);
	ref.authWithCustomToken(token, function(error, authData) {
		if (error) {
			if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
			if(!$('#inv_alert').length) {
				$('<div/>', { id: 'inv_alert', class: 'top-right' }).appendTo('body');
			}
			setTimeout(function() {
				$('#inv_alert').jGrowl(invtoklang, { life: 1500 });
			},200);
		}
		else {
			if ($("#auto_log").length) { $("#auto_log .jGrowl-notification:last-child").remove(); }
			rsbshout(authData.auth);
		}
	});
}

function rsbshout(authData) {

	var numshouts = authData.numshouts,
	noticefb = new Firebase(""+authData.url+"/notice"),
	messagesRef = new Firebase(""+authData.url+"/shout");

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

	if (parseInt(authData.numshouts)>100) {
		numshouts = '100';
	}

	function displayMsg(reqtype, message, username, colorsht, font, size, bold, avatar, edt, type, key, created, ckold, cur){
		var hour = moment(created).utcOffset(parseInt(zoneset)).format(zoneformt);
		message = regexrin(escapeHtml(revescapeHtml(message))),
		nums = numshouts;
		shoutgenerator(reqtype,key,colorsht,font,size,bold,avatar,hour,username,message,type,ckold,direction,nums,cur);
	};

	function checkMsg(req, msg, nick, colorsht, font, size, bold, avatar, edt, type, _id, created, ckold, cur) {
		var mtype = 'shout';
		displayMsg(mtype, msg, nick, colorsht, font, size, bold, avatar, edt, type, _id, created, ckold, cur);
	};

	function newmsg (snapshot,id) {
		docs = snapshot.val();
		key = snapshot.key();
		if (key!=id) {
			checkMsg("msg", docs.msg, docs.nick, docs.colorsht, docs.font, docs.size, docs.bold, docs.avatar, docs.edt, docs.type, snapshot.key(), docs.created, 'new', 0);
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
				checkMsg("msg", docs[i].msg, docs[i].nick, docs[i].colorsht, docs[i].font, docs[i].size, docs[i].bold, docs[i].avatar, docs[i].edt, docs[i].type, docs[i]._id, docs[i].created, 'old', i);
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
}