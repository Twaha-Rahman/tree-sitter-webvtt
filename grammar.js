/**
 * @file A Tree-sitter grammar for WebVTT using Regex
 * @author Twaha Rahman <twaha.rahman.direct@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "webvtt",

  externals: $ => [$.line_without_arrow, $.cue_name],

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
      repeat(
        choice(
          $.region_identifier,
          $.region_width,
          $.region_lines,
          $.region_anchor,
          $.region_viewport_anchor,
          $.region_scroll
        )
      ),
      $.line_terminator
    ),

    region_identifier: $ => seq(
      "id", $.separator_colon, $.line_without_arrow
    ),
    region_width: $ => seq(
      "width", $.separator_colon, $.line_without_arrow
    ),
    region_lines: $ => seq(
      "lines", $.separator_colon, $.line_without_arrow
    ),
    region_anchor: $ => seq(
      "regionanchor", $.separator_colon, $.line_without_arrow
    ),
    region_viewport_anchor: $ => seq(
      "viewportanchor", $.separator_colon, $.line_without_arrow
    ),
    region_scroll: $ => seq(
      "scroll", $.separator_colon, $.line_without_arrow
    ),

    comment_block: $ => seq(
      "NOTE",
      choice(
        $.tab_separator,
        $.space_separator,
        $.line_terminator
      ),
      repeat($.line_without_arrow),
      $.line_terminator
    ),

    style_block: $ => seq(
      "STYLE",
      $.line_terminator,
      repeat($.line_without_arrow),
      $.line_terminator
    ),

    cue_block: $ => seq(
      optional($.cue_name),
      $.timestamp_range_line,
      optional(
        $.cue_settings
      ),
      $.line_terminator,
      repeat(
        $.line_without_arrow
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

    byte_order_mark: () => /\uEFBBBF|\uFEFF|\uFFFE/,

    cue_setting_item: () => /[^ :\n\r]+/,
    separator_colon: () => /:/,

    tab_separator: () => /\t/,
    space_separator: () => / /,

    tabs_or_spaces: () => /[ \t]+/,
    line_terminator: () => /\n|\r\n?/,

    timestamp: () => /([0-9]{2,}:)?[0-9]{2}:[0-9]{2}\.[0-9]{3}/,
    timestamp_arrow: () => /-->/,
  }
});
