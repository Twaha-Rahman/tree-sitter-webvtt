/**
 * @file A Tree-sitter grammar for WebVTT using Regex
 * @author Twaha Rahman <twaha.rahman.direct@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "webvtt",
  conflicts: $ => [[$.source_file]],

  externals: $ => [$.text_including_terminator, $.text_before_terminator, $.cue_name],

  rules: {
    source_file: $ => seq(
      $.webvtt_block,
      repeat($._group1),
      repeat($._line_terminator),
      repeat($._group2),
      repeat($._line_terminator)
    ),

    // Group1 will come before group2 according to the W3C WebVTT spec
    _group1: $ => prec(3, choice($.region_definition_block, $.style_block, $.comment_block)),
    _group2: $ => choice($.cue_block, $.comment_block),

    webvtt_block: $ => prec.left(1, seq(
      optional($.byte_order_mark),
      $.webvtt_keyword,
      optional(
        seq(
          choice($.space_separator, $.tab_separator),
          $.text_before_terminator
        )
      ),
      $._line_terminator,
      repeat($._line_terminator)
    )),

    region_definition_block: $ => seq(
      $.region_keyword,
      optional($.tabs_or_spaces),
      $._line_terminator,
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
      $._line_terminator
    ),

    region_identifier: $ => seq(
      $.id_attribute, $.separator_colon, $.text_including_terminator
    ),
    region_width: $ => seq(
      $.width_attribute, $.separator_colon, $.text_including_terminator
    ),
    region_lines: $ => seq(
      $.lines_attribute, $.separator_colon, $.text_including_terminator
    ),
    region_anchor: $ => seq(
      $.region_anchor_attribute, $.separator_colon, $.text_including_terminator
    ),
    region_viewport_anchor: $ => seq(
      $.viewport_anchor_attribute, $.separator_colon, $.text_including_terminator
    ),
    region_scroll: $ => seq(
      $.scroll_attribute, $.separator_colon, $.text_including_terminator
    ),

    comment_block: $ => seq(
      $.note_keyword,
      choice(
        $.tab_separator,
        $.space_separator,
        $._line_terminator
      ),
      repeat($.text_including_terminator),
      $._line_terminator
    ),

    style_block: $ => seq(
      $.style_keyword,
      optional(choice(repeat($.space_separator), repeat($.tab_separator))),
      $._line_terminator,
      repeat($.text_including_terminator),
      $._line_terminator
    ),

    cue_block: $ => seq(
      optional($.cue_name),
      $.timestamp_range_line,
      optional(
        $.cue_settings
      ),
      $._line_terminator,
      repeat(
        $.text_including_terminator
      ),
      $._line_terminator
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

    webvtt_keyword: $ => /WEBVTT/,
    region_keyword: $ => /REGION/,
    style_keyword: $ => /STYLE/,
    note_keyword: $ => /NOTE/,

    // REGION component attributes
    id_attribute: $ => /id/,
    width_attribute: $ => /width/,
    lines_attribute: $ => /lines/,
    region_anchor_attribute: $ => /regionanchor/,
    viewport_anchor_attribute: $ => /viewportanchor/,
    scroll_attribute: $ => /scroll/,

    cue_setting_item: () => /[^ :\n\r]+/,
    separator_colon: () => /:/,

    tab_separator: () => /\t/,
    space_separator: () => / /,
    tabs_or_spaces: () => /[ \t]+/,

    _line_terminator: () => /\n|\r\n?/,

    timestamp: () => /([0-9]{2,}:)?[0-9]{2}:[0-9]{2}\.[0-9]{3}/,
    timestamp_arrow: () => /-->/,
  }
});
