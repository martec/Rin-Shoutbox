<?php
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

// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
	die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

define('RSB_PLUGIN_VER', '0.3.0');

function rinshoutbox_info()
{
	global $lang;

	$lang->load('config_rinshoutbox');

	return array(
		"name"			=> "Rin Shoutbox",
		"description"	=> $lang->rinshoutbox_plug_desc,
		"author"		=> "martec",
		"authorsite"	=> "",
		"version"		=> RSB_PLUGIN_VER,
		"compatibility" => "18*"
	);
}

function rinshoutbox_install()
{
	global $db, $lang;

	$lang->load('config_rinshoutbox');

	$query	= $db->simple_select("settinggroups", "COUNT(*) as rows");
	$dorder = $db->fetch_field($query, 'rows') + 1;

	$groupid = $db->insert_query('settinggroups', array(
		'name'		=> 'rinshoutbox',
		'title'		=> 'Rin Shoutbox',
		'description'	=> $lang->rinshoutbox_sett_desc,
		'disporder'	=> $dorder,
		'isdefault'	=> '0'
	));

	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_online',
		'title' => $lang->rinshoutbox_onoff_title,
		'description' => $lang->rinshoutbox_onoff_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 1,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_height',
		'title' => $lang->rinshoutbox_heigh_title,
		'description' => $lang->rinshoutbox_heigh_desc,
		'optionscode' => 'numeric',
		'value' => '200',
		'disporder' => 2,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_num_shouts',
		'title' => $lang->rinshoutbox_shoutlimit_title,
		'description' => $lang->rinshoutbox_shoutlimit_desc,
		'optionscode' => 'numeric',
		'value' => '25',
		'disporder' => 3,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_lognum_shouts',
		'title' => $lang->rinshoutbox_logshoutlimit_title,
		'description' => $lang->rinshoutbox_logshoutlimit_desc,
		'optionscode' => 'numeric',
		'value' => '50',
		'disporder' => 4,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_grups_acc',
		'title' => $lang->rinshoutbox_nogrp_title,
		'description' => $lang->rinshoutbox_nogrp_desc,
		'optionscode' => 'groupselect',
		'value' => '7',
		'disporder' => 5,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_mod_grups',
		'title' => $lang->rinshoutbox_mod_title,
		'description' => $lang->rinshoutbox_mod_desc,
		'optionscode' => 'groupselect',
		'value' => '3,4,6',
		'disporder' => 6,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_guest',
		'title' => $lang->rinshoutbox_guest_title,
		'description' => $lang->rinshoutbox_guest_desc,
		'optionscode' => 'yesno',
		'value' => '0',
		'disporder' => 7,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_title',
		'title' => $lang->rinshoutbox_shout_title,
		'description' => $lang->rinshoutbox_shout_desc,
		'optionscode' => 'text',
		'value' => 'Rin Shoutbox',
		'disporder' => 8,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_server',
		'title' => $lang->rinshoutbox_server_title,
		'description' => $lang->rinshoutbox_server_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 9,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_fsecret',
		'title' => $lang->rinshoutbox_fsecret_title,
		'description' => $lang->rinshoutbox_fsecret_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 10,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_imgurapi',
		'title' => $lang->rinshoutbox_imgur_title,
		'description' => $lang->rinshoutbox_imgur_desc,
		'optionscode' => 'text',
		'value' => '',
		'disporder' => 11,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_dataf',
		'title' => $lang->rinshoutbox_dataf_title,
		'description' => $lang->rinshoutbox_dataf_desc,
		'optionscode' => 'text',
		'value' => 'DD/MM hh:mm A',
		'disporder' => 12,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_antiflood',
		'title' => $lang->rinshoutbox_antiflood_title,
		'description' => $lang->rinshoutbox_antiflood_desc,
		'optionscode' => 'numeric',
		'value' => '0',
		'disporder' => 13,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_newpost',
		'title' => $lang->rinshoutbox_newpost_title,
		'description' => $lang->rinshoutbox_newpost_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 14,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_newthread',
		'title' => $lang->rinshoutbox_newthread_title,
		'description' => $lang->rinshoutbox_newthread_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 15,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_folder_acc',
		'title' => $lang->rinshoutbox_foldacc_title,
		'description' => $lang->rinshoutbox_foldacc_desc,
		'optionscode' => 'forumselect',
		'value' => '',
		'disporder' => 16,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_newpt_color',
		'title' => $lang->rinshoutbox_newptcolor_title,
		'description' => $lang->rinshoutbox_newptcolor_desc,
		'optionscode' => 'text',
		'value' => '#727272',
		'disporder' => 17,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_on_color',
		'title' => $lang->rinshoutbox_oncolor_title,
		'description' => $lang->rinshoutbox_oncolor_desc,
		'optionscode' => 'text',
		'value' => 'green',
		'disporder' => 18,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name'		=> 'rinshoutbox_mention',
		'title'		=> $lang->rinshoutbox_mention_title,
		'description'	=> $lang->rinshoutbox_mention_desc,
		'optionscode'	=> 'onoff',
		'value'		=> '1',
		'disporder'	=> 19,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_ment_style',
		'title' => $lang->rinshoutbox_mentstyle_title,
		'description' => $lang->rinshoutbox_mentstyle_desc,
		'optionscode' => 'text',
		'value' => '5px solid #cd0e0a',
		'disporder' => 20,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_edt_backcolor',
		'title' => $lang->rinshoutbox_edtcolor_title,
		'description' => $lang->rinshoutbox_edtcolor_desc,
		'optionscode' => 'text',
		'value' => '#f5caca',
		'disporder' => 21,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_zone',
		'title' => $lang->rinshoutbox_zone_title,
		'description' => $lang->rinshoutbox_zone_desc,
		'optionscode' => 'text',
		'value' => '-3',
		'disporder' => 22,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_shouts_start',
		'title' => $lang->rinshoutbox_shoutstart_title,
		'description' => $lang->rinshoutbox_shoutstart_desc,
		'optionscode' => 'radio
'.$lang->rinshoutbox_shoutstart_opt.'',
		'value' => 'bottom',
		'disporder' => 23,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_act_autoimag',
		'title' => $lang->rinshoutbox_actaimg_title,
		'description' => $lang->rinshoutbox_actaimg_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 24,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_aimg_replacement',
		'title' => $lang->rinshoutbox_aimgrepl_title,
		'description' => $lang->rinshoutbox_aimgrepl_desc,
		'optionscode' => 'textarea',
		'value' => '',
		'disporder' => 25,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_lim_character',
		'title' => $lang->rinshoutbox_limcharact_title,
		'description' => $lang->rinshoutbox_limcharact_desc,
		'optionscode' => 'numeric',
		'value' => 0,
		'disporder' => 26,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_act_avatar',
		'title' => $lang->rinshoutbox_aavatar_title,
		'description' => $lang->rinshoutbox_aavatar_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 27,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_act_color',
		'title' => $lang->rinshoutbox_acolor_title,
		'description' => $lang->rinshoutbox_acolor_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 28,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_act_bold',
		'title' => $lang->rinshoutbox_acbold_title,
		'description' => $lang->rinshoutbox_acbold_desc,
		'optionscode' => 'yesno',
		'value' => 1,
		'disporder' => 29,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_styles_font',
		'title' => $lang->rinshoutbox_stfont_title,
		'description' => $lang->rinshoutbox_stfont_desc,
		'optionscode' => 'textarea',
		'value' => 'Arial,Arial Black,Comic Sans MS,Courier New,Georgia,Impact,Sans-serif,Serif,Times New Roman,Trebuchet MS,Verdana',
		'disporder' => 30,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_styles_size',
		'title' => $lang->rinshoutbox_sizfont_title,
		'description' => $lang->rinshoutbox_sizfont_desc,
		'optionscode' => 'textarea',
		'value' => '11,12,13',
		'disporder' => 31,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_deststyl_select',
		'title' => $lang->rinshoutbox_deststyl_title,
		'description' => $lang->rinshoutbox_deststyl_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 32,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_dis_colorusrn',
		'title' => $lang->rinshoutbox_dcln_title,
		'description' => $lang->rinshoutbox_dcln_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 33,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_def_vol',
		'title' => $lang->rinshoutbox_dvol_title,
		'description' => $lang->rinshoutbox_dvol_desc,
		'optionscode' => 'radio
'.$lang->rinshoutbox_dvol_opt.'',
		'value' => '0',
		'disporder' => 34,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_des_index',
		'title' => $lang->rinshoutbox_destindx_title,
		'description' => $lang->rinshoutbox_destindx_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 35,
		'gid'		=> $groupid
	);
	$rinshoutbox_setting[] = array(
		'name' => 'rinshoutbox_act_port',
		'title' => $lang->rinshoutbox_actport_title,
		'description' => $lang->rinshoutbox_actport_desc,
		'optionscode' => 'yesno',
		'value' => 0,
		'disporder' => 36,
		'gid'		=> $groupid
	);

	$db->insert_query_multiple("settings", $rinshoutbox_setting);
	rebuild_settings();
}

function rinshoutbox_uninstall()
{
	global $db;

	$groupid = $db->fetch_field(
		$db->simple_select('settinggroups', 'gid', "name='rinshoutbox'"),
		'gid'
	);

	$db->delete_query('settings', 'gid=' . $groupid);

	$db->delete_query("settinggroups", "name = 'rinshoutbox'");
	rebuild_settings();
}

function rinshoutbox_is_installed()
{
	global $db;

	$query = $db->simple_select("settinggroups", "COUNT(*) as rows", "name = 'rinshoutbox'");
	$rows  = $db->fetch_field($query, 'rows');

	return ($rows > 0);
}

function rinshoutbox_activate()
{

	global $db;
	require MYBB_ROOT.'/inc/adminfunctions_templates.php';

	$new_template_global['codebutrsb'] = "<link href=\"{\$mybb->asset_url}/jscripts/rin/shoutbox/style.css?ver=".RSB_PLUGIN_VER."\" rel='stylesheet' type='text/css'>
<script src=\"https://cdn.firebase.com/js/client/2.2.9/firebase.js\"></script>
<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/css/select2.min.css\">
<script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/js/select2.min.js\"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min.js'></script>
<link rel=\"stylesheet\" href=\"{\$mybb->asset_url}/jscripts/rin/shoutbox/editor.css?ver=".RSB_PLUGIN_VER."\" type=\"text/css\" media=\"all\" />
<script type=\"text/javascript\">
<!--
	var emoticons = {
		dropdown: {
			{\$dropdownsmilies}
		},
		more: {
			{\$moresmilies}
		}
	},
	rinshoutbox_smilies = {
		{\$smilies_json}
	},
	shoutvol = '{\$mybb->settings['rinshoutbox_def_vol']}',
	iclid = '{\$mybb->settings['rinshoutbox_imgurapi']}',
	maxnamelength = '{\$mybb->settings['maxnamelength']}',
	rsbfontsize = '{\$mybb->settings['rinshoutbox_styles_size']}',
	rsbfontype = '{\$mybb->settings['rinshoutbox_styles_font']}',
	shout_lang = '{\$lang->rinshoutbox_shout}',
	add_spolang = '{\$lang->rinshoutbox_add_spoiler}',
	spo_lan = '{\$lang->rinshoutbox_spoiler}',
	show_lan = '{\$lang->rinshoutbox_show}',
	hide_lan = '{\$lang->rinshoutbox_hide}',
	upimgurlang = '{\$lang->rinshoutbox_up_imgur}',
	connectlang = '{\$lang->rinshoutbox_connect}',
	logofflang = '{\$lang->rinshoutbox_logoff}',
	aloadlang = '{\$lang->rinshoutbox_auto_load}',
	invtoklang = '{\$lang->rinshoutbox_inv_token}',
	usractlan = '{\$lang->rinshoutbox_user_ative}',
	mes_emptylan = '{\$lang->rinshoutbox_mes_empty}',
	usr_banlang = '{\$lang->rinshoutbox_user_banned}',
	flood_msglan = '{\$lang->rinshoutbox_flood_msg}',
	secounds_msglan = '{\$lang->rinshoutbox_flood_scds}',
	log_htmllan = '{\$lang->rinshoutbox_log_html}',
	log_msglan = '{\$lang->rinshoutbox_log_msg}',
	log_shoutlan = '{\$lang->rinshoutbox_log_shout}',
	log_nextlan = '{\$lang->rinshoutbox_log_next}',
	log_backlan = '{\$lang->rinshoutbox_log_back}',
	prune_shoutlan = '{\$lang->rinshoutbox_prune_shout}',
	ign_titlan = '{\$lang->rinshoutbox_ign_sys}',
	ign_msglan = '{\$lang->rinshoutbox_ign_usr}',
	ban_msglan = '{\$lang->rinshoutbox_ban_msg}',
	ban_unban_lan = '{\$lang->rinshoutbox_ban_unban}',
	no_ban_usrlan = '{\$lang->rinshoutbox_no_banusr}',
	ban_syslan = '{\$lang->rinshoutbox_ban_sys}',
	ban_selflan = '{\$lang->rinshoutbox_ban_yourself}',
	not_msglan = '{\$lang->rinshoutbox_notice_msg}',
	prune_msglan = '{\$lang->rinshoutbox_prune_msg}',
	del_msglan = '{\$lang->rinshoutbox_del_mesg}',
	banlist_modmsglan = '{\$lang->rinshoutbox_banlist_mod}',
	not_modmsglan = '{\$lang->rinshoutbox_notice_mod}',
	shout_prunedmsglan = '{\$lang->rinshoutbox_pruned}',
	conf_questlan = '{\$lang->rinshoutbox_conf_quest}',
	shout_yeslan = '{\$lang->rinshoutbox_yes}',
	shout_nolan = '{\$lang->rinshoutbox_no}',
	shout_savelan = '{\$lang->rinshoutbox_save}',
	shout_delan = '{\$lang->rinshoutbox_del_msg}',
	cancel_editlan = '{\$lang->rinshoutbox_cancel_edt}',
	sound_lan = '{\$lang->rinshoutbox_sound_msg}',
	volume_lan = '{\$lang->rinshoutbox_volume_msg}',
	min_lan = '{\$lang->rinshoutbox_vmin_msg}',
	max_lan = '{\$lang->rinshoutbox_vmax_msg}',
	ment_sound = '{\$lang->rinshoutbox_mentsound_msg}',
	direction = '{\$mybb->settings['rinshoutbox_shouts_start']}',
	zoneset = '{\$mybb->settings['rinshoutbox_zone']}',
	zoneformt = '{\$mybb->settings['rinshoutbox_dataf']}',
	shout_height = '{\$mybb->settings['rinshoutbox_height']}',
	theme_borderwidth = '{\$theme['borderwidth']}',
	theme_tablespace = '{\$theme['tablespace']}',
	imgurapi = '{\$mybb->settings['rinshoutbox_imgurapi']}',
	orgtit = document.title,
	on_color = '{\$mybb->settings['rinshoutbox_on_color']}',
	ment_borderstyle = '{\$mybb->settings['rinshoutbox_ment_style']}',
	edt_color = '{\$mybb->settings['rinshoutbox_edt_backcolor']}',
	actaimg = '{\$mybb->settings['rinshoutbox_act_autoimag']}',
	aimgrepl = '{\$mybb->settings['rinshoutbox_aimg_replacement']}',
	actavat = '{\$mybb->settings['rinshoutbox_act_avatar']}',
	actcolor = '{\$mybb->settings['rinshoutbox_act_color']}',
	actbold = '{\$mybb->settings['rinshoutbox_act_bold']}',
	destyl = '{\$mybb->settings['rinshoutbox_deststyl_select']}',
	dcusrname = '{\$mybb->settings['rinshoutbox_dis_colorusrn']}',
	{\$editor_language}
// -->
</script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/rin/shoutbox/yui.editor.js?ver=".RSB_PLUGIN_VER."\"></script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/rin/shoutbox/yui.editor.helper.js?ver=".RSB_PLUGIN_VER."\"></script>
{\$yui_mention}
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/rin/shoutbox/rinshoutbox.helper.js?ver=".RSB_PLUGIN_VER."\"></script>
<script type=\"text/javascript\">
\$(document).ready(function() {
	rinshoutbox_connect();
});
</script>";

	$new_template_global['rinshoutbox_template'] = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"4\" class=\"tborder tShout\">
	<thead>
		<tr>
			<td class=\"thead theadShout\" colspan=\"1\">
				<div class=\"expcolimage\"><img src=\"{\$theme['imgdir']}/collapse{\$collapsedimg['rshout']}.png\" id=\"rshout_img\" class=\"expander\" alt=\"[-]\" title=\"[-]\" /></div>
				<div><strong>{\$mybb->settings['rinshoutbox_title']}</strong></div>
			</td>
		</tr>
	</thead>
	<tbody style=\"{\$collapsed['rshout_e']}\" id=\"rshout_e\">
		<tr><td class=\"tcat\"><span class=\"smalltext\"><strong><span>{\$lang->rinshoutbox_notice_msg} : </span><span class='notshow'></span></strong></span></td></tr>
		<tr>
			<td class=\"trow2\">
				<div class=\"contentShout\">
					<div class=\"shouttab tabShout selected\">{\$mybb->settings['rinshoutbox_title']}</div>
					<div class=\"actusr tabShout\">{\$lang->rinshoutbox_user_ative}</div>
					<div class=\"shoutarea wrapShout\" style=\"height:{\$mybb->settings['rinshoutbox_height']}px;\"></div>
					<div class=\"wrapShout numusr\" style=\"height:{\$mybb->settings['rinshoutbox_height']}px;display:none;\"></div>
					<form id=\"rsb-form\">
						<textarea type=\"text\" name=\"shout_text\" class=\"editorShout\" id=\"shout_text\" data-type=\"shout\" autocomplete=\"off\"></textarea>{\$codebutrsb}
					</form>
				</div>
			</td>
		</tr>
	</tbody>
</table>";

	$new_template_global['rinshoutbox_guest_template'] = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"4\" class=\"tborder tShout\">
	<thead>
		<tr>
			<td class=\"thead theadShout\" colspan=\"1\">
				<div class=\"expcolimage\"><img src=\"{\$theme['imgdir']}/collapse{\$collapsedimg['rshout']}.png\" id=\"rshout_img\" class=\"expander\" alt=\"[-]\" title=\"[-]\" /></div>
				<div><strong>{\$mybb->settings['rinshoutbox_title']}</strong></div>
			</td>
		</tr>
	</thead>
	<tbody style=\"{\$collapsed['rshout_e']}\" id=\"rshout_e\">
		<tr><td class=\"tcat\"><span class=\"smalltext\"><strong><span>{\$lang->rinshoutbox_notice_msg} : </span><span class='notshow'></span></strong></span></td></tr>
		<tr>
			<td class=\"trow2\">
				<div class=\"contentShout\">
					<div class=\"shoutarea wrapShout\" style=\"height:{\$mybb->settings['rinshoutbox_height']}px;\"></div>
				</div>
			</td>
		</tr>
	</tbody>
</table>
<link href=\"{\$mybb->asset_url}/jscripts/rin/shoutbox/style.css?ver=".RSB_PLUGIN_VER."\" rel='stylesheet' type='text/css'>
<script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min.js'></script>
<script src=\"https://cdn.firebase.com/js/client/2.2.9/firebase.js\"></script>
<script type=\"text/javascript\">
<!--
	rsbfontsize = '{\$mybb->settings['rinshoutbox_styles_size']}',
	rsbfontype = '{\$mybb->settings['rinshoutbox_styles_font']}',
	spo_lan = '{\$lang->rinshoutbox_spoiler}',
	show_lan = '{\$lang->rinshoutbox_show}',
	hide_lan = '{\$lang->rinshoutbox_hide}',
	aloadlang = '{\$lang->rinshoutbox_auto_load}',
	direction = '{\$mybb->settings['rinshoutbox_shouts_start']}',
	zoneset = '{\$mybb->settings['rinshoutbox_zone']}',
	zoneformt = '{\$mybb->settings['rinshoutbox_dataf']}',
	orgtit = document.title,
	actaimg = '{\$mybb->settings['rinshoutbox_act_autoimag']}',
	aimgrepl = '{\$mybb->settings['rinshoutbox_aimg_replacement']}',
	actavat = '{\$mybb->settings['rinshoutbox_act_avatar']}',
	actcolor = '{\$mybb->settings['rinshoutbox_act_color']}',
	actbold = '{\$mybb->settings['rinshoutbox_act_bold']}',
	destyl = '{\$mybb->settings['rinshoutbox_deststyl_select']}',
	dcusrname = '{\$mybb->settings['rinshoutbox_dis_colorusrn']}';
// -->
</script>
<script type=\"text/javascript\" src=\"{\$mybb->asset_url}/jscripts/rin/shoutbox/rinshoutbox.helper.guest.js?ver=".RSB_PLUGIN_VER."\"></script>
<script type=\"text/javascript\">
rinshoutbox_smilies = {
	{\$smilies_json}
};
\$(document).ready(function() {
	rinshoutbox_connect();
});
</script>";

	foreach($new_template_global as $title => $template)
	{
		$new_template_global = array('title' => $db->escape_string($title), 'template' => $db->escape_string($template), 'sid' => '-1', 'version' => '1801', 'dateline' => TIME_NOW);
		$db->insert_query('templates', $new_template_global);
	}

	find_replace_templatesets("index", '#{\$forums}#', "{\$rinshoutbox}\n{\$forums}");
	find_replace_templatesets("portal", '#{\$announcements}#', "{\$rinshoutbox}\n{\$announcements}");
}

function rinshoutbox_deactivate()
{

	global $db;
	require MYBB_ROOT.'/inc/adminfunctions_templates.php';

	$db->delete_query("templates", "title IN('codebutrsb','rinshoutbox_template','rinshoutbox_guest_template')");

	find_replace_templatesets("index", '#'.preg_quote('{$rinshoutbox}').'#', '',0);
	find_replace_templatesets("portal", '#'.preg_quote('{$rinshoutbox}').'#', '',0);
}

global $settings;
if ($settings['rinshoutbox_online']) {
	$plugins->add_hook('global_start', 'rinshoutbox_cache_template');
}
function rinshoutbox_cache_template()
{
	global $templatelist, $mybb;

	if (isset($templatelist)) {
		$templatelist .= ',';
	}

	if (THIS_SCRIPT == 'index.php' && !$mybb->settings['rinshoutbox_des_index']) {
		$templatelist .= 'codebutrsb,rinshoutbox_template,rinshoutbox_guest_template';
	}
	if (THIS_SCRIPT == 'portal.php' && $mybb->settings['rinshoutbox_act_port']) {
		$templatelist .= 'codebutrsb,rinshoutbox_template,rinshoutbox_guest_template';
	}
}

function rinshoutbox_bbcode_func($smilies = true)
{
	global $db, $mybb, $theme, $templates, $lang, $smiliecache, $cache;

	if (!$lang->rinshoutbox) {
		$lang->load('rinshoutbox');
	}

	$editor_lang_strings = array(
		"editor_bold" => "Bold",
		"editor_italic" => "Italic",
		"editor_underline" => "Underline",
		"editor_strikethrough" => "Strikethrough",
		"editor_subscript" => "Subscript",
		"editor_superscript" => "Superscript",
		"editor_alignleft" => "Align left",
		"editor_center" => "Center",
		"editor_alignright" => "Align right",
		"editor_justify" => "Justify",
		"editor_fontname" => "Font Name",
		"editor_fontsize" => "Font Size",
		"editor_fontcolor" => "Font Color",
		"editor_removeformatting" => "Remove Formatting",
		"editor_cut" => "Cut",
		"editor_cutnosupport" => "Your browser does not allow the cut command. Please use the keyboard shortcut Ctrl/Cmd-X",
		"editor_copy" => "Copy",
		"editor_copynosupport" => "Your browser does not allow the copy command. Please use the keyboard shortcut Ctrl/Cmd-C",
		"editor_paste" => "Paste",
		"editor_pastenosupport" => "Your browser does not allow the paste command. Please use the keyboard shortcut Ctrl/Cmd-V",
		"editor_pasteentertext" => "Paste your text inside the following box:",
		"editor_pastetext" => "PasteText",
		"editor_numlist" => "Numbered list",
		"editor_bullist" => "Bullet list",
		"editor_undo" => "Undo",
		"editor_redo" => "Redo",
		"editor_rows" => "Rows:",
		"editor_cols" => "Cols:",
		"editor_inserttable" => "Insert a table",
		"editor_inserthr" => "Insert a horizontal rule",
		"editor_code" => "Code",
		"editor_width" => "Width (optional):",
		"editor_height" => "Height (optional):",
		"editor_insertimg" => "Insert an image",
		"editor_email" => "E-mail:",
		"editor_insertemail" => "Insert an email",
		"editor_url" => "URL:",
		"editor_insertlink" => "Insert a link",
		"editor_unlink" => "Unlink",
		"editor_more" => "More",
		"editor_insertemoticon" => "Insert an emoticon",
		"editor_videourl" => "Video URL:",
		"editor_videotype" => "Video Type:",
		"editor_insert" => "Insert",
		"editor_insertyoutubevideo" => "Insert a YouTube video",
		"editor_currentdate" => "Insert current date",
		"editor_currenttime" => "Insert current time",
		"editor_print" => "Print",
		"editor_viewsource" => "View source",
		"editor_description" => "Description (optional):",
		"editor_enterimgurl" => "Enter the image URL:",
		"editor_enteremail" => "Enter the e-mail address:",
		"editor_enterdisplayedtext" => "Enter the displayed text:",
		"editor_enterurl" => "Enter URL:",
		"editor_enteryoutubeurl" => "Enter the YouTube video URL or ID:",
		"editor_insertquote" => "Insert a Quote",
		"editor_invalidyoutube" => "Invalid YouTube video",
		"editor_dailymotion" => "Dailymotion",
		"editor_metacafe" => "MetaCafe",
		"editor_veoh" => "Veoh",
		"editor_vimeo" => "Vimeo",
		"editor_youtube" => "Youtube",
		"editor_facebook" => "Facebook",
		"editor_liveleak" => "LiveLeak",
		"editor_insertvideo" => "Insert a video",
		"editor_php" => "PHP",
		"editor_maximize" => "Maximize"
	);
	$editor_language = "yuivar = {\n";

	$editor_languages_count = count($editor_lang_strings);
	$i = 0;
	foreach($editor_lang_strings as $lang_string => $key)
	{
		$i++;
		$js_lang_string = str_replace("\"", "\\\"", $key);
		$string = str_replace("\"", "\\\"", $lang->$lang_string);
		$editor_language .= "\t\"{$js_lang_string}\": \"{$string}\"";

		if($i < $editor_languages_count)
		{
			$editor_language .= ",";
		}

		$editor_language .= "\n";
	}

	$editor_language .= "};";

	if(defined("IN_ADMINCP"))
	{
		global $page;
		$rinshoutboxbbcode = $page->build_codebuttons_editor($editor_language, $smilies);
	}
	else
	{
		// Smilies
		$emoticon = "";
		$emoticons_enabled = "false";
		if($smilies && $mybb->settings['smilieinserter'] != 0 && $mybb->settings['smilieinsertercols'] && $mybb->settings['smilieinsertertot'])
		{
			$emoticon = ",emoticon";
			$emoticons_enabled = "true";

			if(!$smiliecache)
			{
				if(!is_array($smilie_cache))
				{
					$smilie_cache = $cache->read("smilies");
				}
				foreach($smilie_cache as $smilie)
				{
					if($smilie['showclickable'] != 0)
					{
						$smilie['image'] = str_replace("{theme}", $theme['imgdir'], $smilie['image']);
						$smiliecache[$smilie['sid']] = $smilie;
					}
				}
			}

			unset($smilie);

			if(is_array($smiliecache))
			{
				reset($smiliecache);

				$smilies_json = $dropdownsmilies = $moresmilies = $hiddensmilies = "";
				$i = 0;

				foreach($smiliecache as $smilie)
				{
					$finds = explode("\n", $smilie['find']);
					$finds_count = count($finds);

					// Only show the first text to replace in the box
					$smilie['find'] = $finds[0];

					$find = htmlspecialchars_uni($smilie['find']);
					$image = htmlspecialchars_uni($smilie['image']);
					$findfirstquote = preg_quote($find);
					$findsecoundquote = preg_quote($findfirstquote);
					$smilies_json .= '"'.$findsecoundquote.'": "<img src=\"'.$mybb->asset_url.'/'.$image.'\" />",';
					if($i < $mybb->settings['smilieinsertertot'])
					{
						$dropdownsmilies .= '"'.$find.'": "'.$mybb->asset_url.'/'.$image.'",';
					}
					else
					{
						$moresmilies .= '"'.$find.'": "'.$mybb->asset_url.'/'.$image.'",';
					}

					for($j = 1; $j < $finds_count; ++$j)
					{
						$find2 = htmlspecialchars_uni($finds[$j]);
						$hiddensmilies .= '"'.$find.'": "'.$mybb->asset_url.'/'.$image.'",';
					}
					++$i;
				}
			}
		}

		if($mybb->settings['rinshoutbox_mention'] == 1)
		{
			$yui_mention = "<link rel=\"stylesheet\" href=\"".$mybb->asset_url."/jscripts/rin/shoutbox/jquery.atwho.min.css?ver=".RSB_PLUGIN_VER."\" type=\"text/css\" media=\"all\" />
<script type=\"text/javascript\" src=\"".$mybb->asset_url."/jscripts/rin/shoutbox/jquery.caret.min.js?ver=".RSB_PLUGIN_VER."\"></script>
<script type=\"text/javascript\" src=\"".$mybb->asset_url."/jscripts/rin/shoutbox/jquery.atwho.min.js?ver=".RSB_PLUGIN_VER."\"></script>
<script type=\"text/javascript\" src=\"".$mybb->asset_url."/jscripts/rin/shoutbox/yui.mention.js?ver=".RSB_PLUGIN_VER."\"></script>";
		}

		eval("\$rinshoutboxbbcode = \"".$templates->get("codebutrsb")."\";");
	}

	return $rinshoutboxbbcode;
}

if ($settings['rinshoutbox_online'] && !$settings['rinshoutbox_des_index']) {
	$plugins->add_hook('index_start', 'RinShout');
}
if ($settings['rinshoutbox_online'] && $settings['rinshoutbox_act_port']) {
	$plugins->add_hook('portal_start', 'RinShout');
}
function RinShout() {

	global $settings, $mybb, $theme, $templates, $rinshoutbox, $codebutrsb, $lang, $collapsed;

	$codebutrsb = rinshoutbox_bbcode_func();

	if (!$lang->rinshoutbox) {
		$lang->load('rinshoutbox');
	}

	if(!in_array((int)$mybb->user['usergroup'],explode(',',$mybb->settings['rinshoutbox_grups_acc'])) && $mybb->user['uid']!=0) {
		eval("\$rinshoutbox = \"".$templates->get("rinshoutbox_template")."\";");
	}
	elseif ($mybb->user['uid']==0 && $settings['rinshoutbox_guest']==1) {
		eval("\$rinshoutbox = \"".$templates->get("rinshoutbox_guest_template")."\";");
	}

}

function sendPostDataRSB($linklang) {

	global $mybb, $settings;

	if ($mybb->user['uid']==0) {
		$name = 'guest';
		$avatar = '';
		$uid = '0';
	}
	else {
		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$avatar = $mybb->user['avatar'];
		$uid = $mybb->user['uid'];
	}

	$data = array(
		"nick" => $name,
		"msg" => $linklang,
		"uid" => $uid,
		"colorsht" => $mybb->settings['rinshoutbox_newpt_color'],
		"bold" => "NaN",
		"font" => "NaN",
		"size" => "NaN",
		"avatar" => $avatar,
		"created" => TIME_NOW,
		"edt" => "0",
		"type" => "system"
	);

	$emiturl ="".$settings['rinshoutbox_server']."/shout.json?auth=".token_gen()."";

	$ch = curl_init($emiturl);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}

function token_gen() {

	global $mybb, $settings;
	include_once "rsb/FirebaseToken.php";

	if($mybb->user['uid']==0) {
		$name = 'guest';
		$msbusrname = 'guest';
		$avatar = '';
		$gid = '';
		$msbmod = '0';
		$uid = '0';
	}
	else {
		$name = format_name($mybb->user['username'], $mybb->user['usergroup'], $mybb->user['displaygroup']);
		$msbusrname = addslashes($mybb->user['username']);
		$avatar = $mybb->user['avatar'];
		$gid = $mybb->user['usergroup'];
		$msbmod = '0';
		$uid = $mybb->user['uid'];
		if(in_array((int)$mybb->user['usergroup'],explode(',',$mybb->settings['rinshoutbox_mod_grups']))) {
			$msbmod = '1';
		}
	}

	$data = array(
		"user" => $name,
		"mybbusername" => $msbusrname,
		"uid" => $uid,
		"gid" => $gid,
		"rsbmodgroups" => $mybb->settings['rinshoutbox_mod_grups'],
		"mod" => $msbmod,
		"avatar" => $avatar,
		"lc" => (int)$mybb->settings['rinshoutbox_lim_character'],
		"floodtime" => $mybb->settings['rinshoutbox_antiflood']*1000,
		"mpp" => $mybb->settings['rinshoutbox_lognum_shouts'],
		"numshouts" => $mybb->settings['rinshoutbox_num_shouts'],
		"url" => $mybb->settings['rinshoutbox_server']
	);

	$tokenGen = new Services_FirebaseTokenGenerator($mybb->settings['rinshoutbox_fsecret']);
	$token = $tokenGen->createToken($data);
	return $token;
}

if ($settings['rinshoutbox_online'] && $settings['rinshoutbox_newthread']) {
	$plugins->add_hook('newthread_do_newthread_end', 'RSB_newthread');
}
function RSB_newthread()
{
	global $mybb, $tid, $settings, $lang, $forum;

	if(!in_array((int)$forum['fid'],explode(',',$mybb->settings['rinshoutbox_folder_acc']))) {
		$lang->load('admin/config_rinshoutbox');

		$link = '[url=' . $settings['bburl'] . '/' . get_thread_link($tid) . ']' . $mybb->input['subject'] . '[/url]';
		$linklang = $lang->sprintf($lang->rinshoutbox_newthread_lang, $link);

		sendPostDataRSB($linklang);
	}
}

if ($settings['rinshoutbox_online'] && $settings['rinshoutbox_newpost']) {
	$plugins->add_hook('newreply_do_newreply_end', 'RSB_newpost');
}
function RSB_newpost()
{
	global $mybb, $tid, $settings, $lang, $url, $thread, $forum, $db;

	if(!in_array((int)$forum['fid'],explode(',',$mybb->settings['rinshoutbox_folder_acc']))) {
		$lang->load('admin/config_rinshoutbox');

		$MSB_url = htmlspecialchars_decode($url);
		$link = '[url=' . $settings['bburl'] . '/' . $MSB_url . ']' . $thread['subject'] . '[/url]';
		$linklang = $lang->sprintf($lang->rinshoutbox_newpost_lang, $link);

		sendPostDataRSB($linklang);
	}
}

$plugins->add_hook('xmlhttp', 'rinshoutbox_auth');

function rinshoutbox_auth()
{
	global $mybb, $lang, $parser, $settings;

	if (!is_object($parser))
	{
		require_once MYBB_ROOT.'inc/class_parser.php';
		$parser = new postParser;
	}

	if ($mybb->input['action'] != "rinshoutbox_gettoken" || $mybb->request_method != "post"){return false;exit;}

	if (!verify_post_check($mybb->input['my_post_key'], true))
	{
		xmlhttp_error($lang->invalid_post_code);
	}

	if ($mybb->input['action'] == "rinshoutbox_gettoken"){

		$arraytoken = array('token' => token_gen(), 'url' => $mybb->settings['rinshoutbox_server']);
		echo json_encode($arraytoken);
	}
}

?>