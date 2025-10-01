/**
 * @file A Tree-sitter grammar for WebVTT using Regex
 * @author Twaha Rahman <twaha.rahman.direct@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "webvtt",

  rules: {
    source_file: $ => seq(
      $.webvtt_block,
      repeat($.items)
    ),

    items: $ => choice(
      $.style_block,
      $.comment_block,
      $.cue_block,
      $.region_definition_block
    ),

    webvtt_block: $ => seq(
      optional($.byte_order_mark),
      /WEBVTT/,
      $.line_terminator,
      repeat($.line_terminator)
    ),

    region_definition_block: $ => seq(
      "REGION",
      optional($.tabs_or_spaces),
      $.line_terminator,
      repeat($.region_setting_component),
      $.line_terminator
    ),

    region_setting_component: $ => /[^\n\r]+(\n|\r|\r\n)/,

    comment_block: $ => seq(
      "NOTE",
      choice(
        $.tab_separator,
        $.space_separator,
        $.line_terminator
      ),
      repeat($.line_with_terminator),
      $.line_terminator
    ),

    style_block: $ => seq(
      "STYLE",
      $.line_terminator,
      repeat($.line_with_terminator),
      $.line_terminator
    ),

    cue_block: $ => seq(
      optional($.cue_identifier),
      $.timestamp_range_line,
      optional(
        $.cue_settings
      ),
      $.line_terminator,
      repeat(
        $.line_with_terminator
      ),
      $.line_terminator
    ),

    cue_settings: $ => seq(
      $.tabs_or_spaces,
      repeat($.cue_setting)
    ),

    cue_setting: $ => seq(
      $.cue_setting_item,
      $.separator_colon,
      $.cue_setting_item,
    ),

    timestamp_range_line: $ => seq(
      $.timestamp,
      choice(
        repeat1($.space_separator),
        repeat1($.tab_separator)
      ),
      $.timestamp_arrow,
      $.timestamp,
    ),

    byte_order_mark: $ => /(\uEFBBBF|\uFEFF|\uFFFE)/,

    webvtt_header: $ => /WEBVTT/,

    cue_identifier: $ => /((((([^NSR\n\r][^\n\r]{5})|((N|S|R)[^OTE\n\r][^\n\r]{4})|((NO|ST|RE)[^TYG\n\r][^\n\r]{3})|((NOT|STY|REG)[^ELI\n\r][^\n\r]{2})|((STYL|REGI)[^EO\n\r][^\n\r])|(REGIO[^N\n\r])))((([^\n\r]{0,6}(\n|\r\n?))|([^\n\r]{4}((-(([^-\n\r][^\n\r])|([^\n\r][^>\n\r]))[^\n\r]*)|([^\n\r]{1,5})|([^-\n\r][^\r\n]{2}((([^-\n\r][^\n\r]{2})|([^\n\r][^-\n\r][^\n\r])|([^\n\r][^\n\r][^>\n\r]))))[^\n\r]*)(\n|\r\n?)))))|((([^\n\r]{3}[^E\r\n])|([^N\r\n][^\n\r]{3})|([^\r\n][^O\r\n][^\n\r]{2})|([^\r\n]{2}[^T\r\n][^\n\r])|([^\n\r]{4}[^E\r\n]))(\n|\r\n?))|((([^S\n\r][^\n\r]{4})|([^\n\r][^T\n\r][^\n\r]{3})|([^\n\r]{2}[^Y\n\r][^\n\r]{2})|([^\n\r]{3}[^L\n\r][^\n\r]))(\n|\r\n?))|([^\n\r]{1,3})(\n|\r\n?))/,

    cue_setting_item: $ => /[^ :\n\r]+/,
    separator_colon: $ => /:/,

    tab_separator: $ => /\t/,
    space_separator: $ => / /,

    tabs_or_spaces: $ => /[ \t]+/,
    line_terminator: $ => /(\n|\r|\n\r)/,

    timestamp: $ => /([0-9]{2,}:)?([0-9]{2}:[0-9]{2}\.[0-9]{3})/,

    timestamp_range_arrow: $ => / --> /,
    timestamp_arrow: $ => /-->/,

    line_with_terminator: $ => /((.{10}(([^-\n][^\n][^\n])|([^\n][^-\n][^\n])|([^\n][^\n][^>\n]))[^\n]*)|([^\n]{1,12}))(\n|\r|\n\r|\r\n)/,
    line_without_terminator: $ => /((.{10}(([^-\n][^\n][^\n])|([^\n][^-\n][^\n])|([^\n][^\n][^>\n]))[^\n]*)|([^\n]{1,12}))/
  }
});
