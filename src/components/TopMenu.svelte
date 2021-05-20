<script lang="ts">
  import { getDirectLink } from '../store';
  import UIkit from 'uikit';

  function showDirectLink() {
    const r = getDirectLink();
    const code = `
    ${r.anySkipped ? `<div class="uk-alert uk-alert-warning">Some datasets could not be linked</div>` : ''}
    <input value="${r.url.href}" readonly />
    `;
    UIkit.modal.alert(code);
  }
</script>

<div style="grid-area: menu">
  <div id="file_csv" class="ui_flag ui_flag_icon"><i class="fa fa-folder-open" /></div>
  <div id="file_api" class="ui_flag ui_flag_icon"><i class="fa fa-database" /></div>
  <div id="file_draw" class="ui_flag ui_flag_icon"><i class="fa fa-pencil" /></div>
  <div id="file_kernels" class="ui_flag ui_flag_icon"><i class="fa fa-code" /></div>
  <div id="file_tree" class="ui_flag ui_flag_icon ui_flag_icon_selected"><i class="fa fa-list" /></div>
  <div id="file_fullscreen" class="ui_flag ui_flag_icon" style="display: none;">
    <i class="fa fa-external-link-square" />
  </div>
  <div class="spacer" />
  <div id="action_randomize" class="ui_flag ui_flag_icon"><i class="fa fa-paint-brush" /></div>
  <div id="action_autoscale" class="ui_flag ui_flag_icon"><i class="fa fa-arrows-alt" /></div>
  <div id="action_showpoints" class="ui_flag ui_flag_icon"><i class="fa fa-ellipsis-h" /></div>
  <div id="action_multiscale" class="ui_flag ui_flag_icon ui_flag_icon_disabled"><i class="fa fa-anchor" /></div>
  <div id="action_regress" class="ui_flag ui_flag_icon ui_flag_icon_disabled"><i class="fa fa-line-chart" /></div>
  <div id="action_reset" class="ui_flag ui_flag_icon ui_flag_icon_disabled"><i class="fa fa-refresh" /></div>
  <div id="action_screenshot" class="ui_flag ui_flag_icon"><i class="fa fa-picture-o" /></div>
  <div id="action_directlink" class="ui_flag ui_flag_icon" on:click={showDirectLink}><i class="fa fa-link" /></div>
  <div id="action_undo" class="ui_flag ui_flag_icon ui_flag_icon_disabled"><i class="fa fa-undo" /></div>
  <div id="action_redo" class="ui_flag ui_flag_icon ui_flag_icon_disabled"><i class="fa fa-repeat" /></div>
  <div class="spacer" />
  <div id="navmode_pan" class="ui_flag ui_flag_icon ui_flag_icon_selected"><i class="fa fa-arrows" /></div>
  <div id="navmode_crop" class="ui_flag ui_flag_icon"><i class="fa fa-crop" /></div>
  <div id="navmode_zoom" class="ui_flag ui_flag_icon"><i class="fa fa-expand" /></div>
</div>
