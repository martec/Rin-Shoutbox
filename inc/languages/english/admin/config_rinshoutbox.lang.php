<?php
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
$l['rinshoutbox_plug_desc'] = 'Firebase Shoutbox for Mybb.';
$l['rinshoutbox_sett_desc'] = 'Settings for the Rin Shoutbox.';
$l['rinshoutbox_onoff_title'] = 'Enable Rin Shoutbox?';
$l['rinshoutbox_onoff_desc'] = 'Set here if you want enable or disable Rin Shoutbox.';
$l['rinshoutbox_heigh_title'] = 'Shoutbox height';
$l['rinshoutbox_heigh_desc'] = 'Set here height of Shoutbox (value in px).';
$l['rinshoutbox_shoutlimit_title'] = 'Amount of shouts';
$l['rinshoutbox_shoutlimit_desc'] = 'Set here amount of shouts that will appear in shout area. (Limit: 100)';
$l['rinshoutbox_logshoutlimit_title'] = 'Amount of shouts in log (archive)';
$l['rinshoutbox_logshoutlimit_desc'] = 'Set here amount of shouts that will appear in log (archive). (Limit: 200)';
$l['rinshoutbox_nogrp_title'] = 'Group without permission to use';
$l['rinshoutbox_nogrp_desc'] = 'Set here group that does not has permission to use Rin Shoutbox.';
$l['rinshoutbox_mod_title'] = 'Mod Group';
$l['rinshoutbox_mod_desc'] = 'Set here group with moderation privilege.';
$l['rinshoutbox_edt_title'] = 'Edit/Delete privilege Group';
$l['rinshoutbox_edt_desc'] = 'Set here group that can edit and delete own shout.';
$l['rinshoutbox_guest_title'] = 'Read mode to guest';
$l['rinshoutbox_guest_desc'] = 'Guest not has access to this shout. But you can enable read only mode to guest here.';
$l['rinshoutbox_shout_title'] = 'Title of Rin Shoutbox';
$l['rinshoutbox_shout_desc'] = 'Set here title of shoutbox that will appear.';
$l['rinshoutbox_apikey_title'] = 'Your Firebase API Key';
$l['rinshoutbox_apikey_desc'] = 'Set here Firebase API Key.';
$l['rinshoutbox_authdomain_title'] = 'Your Firebase Authentication Domain';
$l['rinshoutbox_authdomain_desc'] = 'Set here Firebase Authentication Domain.';
$l['rinshoutbox_databaseurl_title'] = 'Your Firebase Database URL';
$l['rinshoutbox_databaseurl_desc'] = 'Set here Firebase Database URL.';
$l['rinshoutbox_clientemail_title'] = 'Your Firebase Client Email';
$l['rinshoutbox_clientemail_desc'] = 'Set here Firebase Client Email.';
$l['rinshoutbox_privatekey_title'] = 'Your Firebase Private Key';
$l['rinshoutbox_privatekey_desc'] = 'Set here Firebase Private Key.';
$l['rinshoutbox_fsecret_title'] = 'Your Firebase Secret';
$l['rinshoutbox_fsecret_desc'] = 'Set here Firebase Secret.';
$l['rinshoutbox_imgur_title'] = 'Imgur';
$l['rinshoutbox_imgur_desc'] = 'Set here API of imgur.';
$l['rinshoutbox_dataf_title'] = 'Date Format';
$l['rinshoutbox_dataf_desc'] = 'Set here date format (Options of format you can check in http://momentjs.com/docs/).';
$l['rinshoutbox_antiflood_title'] = 'Anti flood system';
$l['rinshoutbox_antiflood_desc'] = 'Set here time in secound that user need wait before to shout another message. Set 0 to disable this feature.';
$l['rinshoutbox_newpost_title'] = 'Shout new post';
$l['rinshoutbox_newpost_desc'] = 'Shout when someone post in thread.';
$l['rinshoutbox_newthread_title'] = 'Shout new thread';
$l['rinshoutbox_newthread_desc'] = 'Shout when someone post new thread.';
$l['rinshoutbox_foldacc_title'] = 'Folder ignored by Shout new post and Shout new thread';
$l['rinshoutbox_foldacc_desc'] = 'Set here folder that Rin Shoutbox will ignore when someone post in forum (value in id).<br />Separate each forum id with comma.';
$l['rinshoutbox_newptcolor_title'] = 'Color for new thread and new post shout';
$l['rinshoutbox_newptcolor_desc'] = 'Set here color for new thread and new post shout.';
$l['rinshoutbox_oncolor_title'] = 'Online border color';
$l['rinshoutbox_oncolor_desc'] = 'Set border color to online users.';
$l['rinshoutbox_mentstyle_title'] = 'Mention border style';
$l['rinshoutbox_mentstyle_desc'] = 'Set border style to mention.';
$l['rinshoutbox_edtcolor_title'] = 'Background color to edited shout';
$l['rinshoutbox_edtcolor_desc'] = 'Set background color to edited shout.';
$l['rinshoutbox_zone_title'] = 'Timezone';
$l['rinshoutbox_zone_desc'] = 'Set your Timezone here.';
$l['rinshoutbox_shoutstart_title'] = 'Display direction of shouts';
$l['rinshoutbox_shoutstart_desc'] = 'Choice display direction.';
$l['rinshoutbox_shoutstart_opt'] = 'top=Top
bottom=Bottom';
$l['rinshoutbox_actaimg_title'] = 'Active auto image load?';
$l['rinshoutbox_actaimg_desc'] = 'Set if you want active auto image load. If you select yes, Rin Shoutbox will load image link automatically.';
$l['rinshoutbox_aimgrepl_title'] = 'Replacement to auto image load';
$l['rinshoutbox_aimgrepl_desc'] = 'Enter a replacement for the regular expression.<br /><strong>Example:</strong> https://myproxy/$1';
$l['rinshoutbox_limcharact_title'] = 'Character limit';
$l['rinshoutbox_limcharact_desc'] = 'Set character limit here. Set 0 to disable this feature.';
$l['rinshoutbox_aavatar_title'] = 'Active avatar in Rin Shoutbox?';
$l['rinshoutbox_aavatar_desc'] = 'Set if you want active avatar in Rin Shoutbox. If you select yes, Rin Shoutbox will show avatar.';
$l['rinshoutbox_acolor_title'] = 'Active color in Rin Shoutbox?';
$l['rinshoutbox_acolor_desc'] = 'Set if you want active color in Rin Shoutbox. If you select yes, Rin Shoutbox will give color option to users.';
$l['rinshoutbox_acbold_title'] = 'Active bold style in Rin Shoutbox?';
$l['rinshoutbox_acbold_desc'] = 'Set if you want active bold style in Rin Shoutbox. If you select yes, Rin Shoutbox will give bold style option to users.';
$l['rinshoutbox_stfont_title'] = 'Fonts';
$l['rinshoutbox_stfont_desc'] = 'Set here font-family that users can use.';
$l['rinshoutbox_sizfont_title'] = 'Font sizes';
$l['rinshoutbox_sizfont_desc'] = 'Set here font-size that users can use.';
$l['rinshoutbox_deststyl_title'] = 'Desactive style select?';
$l['rinshoutbox_deststyl_desc'] = 'Set if you want desactive style.';
$l['rinshoutbox_dcln_title'] = 'Disable style in username?';
$l['rinshoutbox_dcln_desc'] = 'Set if you want disable style in username. If you select yes, Rin Shoutbox will disable style in username.';
$l['rinshoutbox_dvol_title'] = 'Default volume';
$l['rinshoutbox_dvol_desc'] = 'Choice default volume.';
$l['rinshoutbox_dvol_opt'] = '0=Min
0.5=Medium
1=Max';
$l['rinshoutbox_destindx_title'] = 'Hide Rin Shoutbox in Index page?';
$l['rinshoutbox_destindx_desc'] = 'Set here if you want hide shoutbox in index or not.';
$l['rinshoutbox_actport_title'] = 'Show Rin Shoutbox in Portal page?';
$l['rinshoutbox_actport_desc'] = 'Set here if you want show shoutbox in portal or not.';
$l['rinshoutbox_newpost_lang'] = 'posted in thread {1}. There may be more posts after this.';
$l['rinshoutbox_newthread_lang'] = 'posted new thread {1}';
?>