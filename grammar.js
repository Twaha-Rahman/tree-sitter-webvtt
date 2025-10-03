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
  externals: $ => [$.text_including_terminator, $.text_before_terminator, $.cue_name, $.error_sentinel],
  extras: $ => [$.byte_order_mark],

  rules: {
    source_file: $ => seq(
      $.webvtt_block,
      repeat($._group1),
      repeat($._line_terminator),
      repeat($._group2),
      repeat($._line_terminator)
    ),

    // Group1 will come before group2 according to the W3C WebVTT spec
    _group1: $ => prec(2, choice($.region_definition_block, $.style_block, $.comment_block)),
    _group2: $ => choice($.cue_block, $.comment_block),

    webvtt_block: $ => prec.left(1, seq(
      optional($.byte_order_mark),
      $.webvtt_keyword,
      optional(
        seq(
          choice($._space_separator, $._tab_separator),
          alias($.text_before_terminator, $.optional_webvtt_trailing_text)
        )
      ),
      $._line_terminator,
      repeat1($._line_terminator)
    )),

    region_definition_block: $ => seq(
      $.region_keyword,
      optional($._tabs_or_spaces),
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
      $.id_attribute,
      $.separator_colon,
      alias($.text_including_terminator, $.attribute_value)
    ),
    region_width: $ => seq(
      $.width_attribute, $.separator_colon, $.webvtt_percentage, $._line_terminator
    ),
    region_lines: $ => seq(
      $.lines_attribute, $.separator_colon, alias($.ascii_digits, $.attribute_value), $._line_terminator
    ),
    region_anchor: $ => seq(
      $.region_anchor_attribute, $.separator_colon, $.webvtt_percentage_pair, $._line_terminator
    ),
    region_viewport_anchor: $ => seq(
      $.viewport_anchor_attribute, $.separator_colon, $.webvtt_percentage_pair, $._line_terminator
    ),
    region_scroll: $ => seq(
      $.scroll_attribute,
      $.separator_colon,
      alias($.text_including_terminator, $.attribute_value)
    ),

    comment_block: $ => seq(
      $.note_keyword,
      choice(
        $._tab_separator,
        $._space_separator,
        $._line_terminator
      ),
      repeat(alias($.text_including_terminator, $.commented_text)),
      $._line_terminator
    ),

    style_block: $ => seq(
      $.style_keyword,
      optional(choice(repeat($._space_separator), repeat($._tab_separator))),
      $._line_terminator,
      repeat(alias($.text_including_terminator, $.css_style)),
      $._line_terminator
    ),

    cue_block: $ => seq(
      optional($.cue_name),
      $.cue_timings,
      optional(
        repeat($.cue_settings)
      ),
      $._line_terminator,
      repeat(
        alias($.text_including_terminator, $.cue_payload)
      ),
      $._line_terminator
    ),

    cue_settings: $ => seq(
      $._tabs_or_spaces,
      $.cue_setting
    ),

    cue_setting: $ => seq(
      alias($.cue_setting_item, $.cue_setting_name),
      optional(
        seq(
          $.separator_colon,
          alias($.cue_setting_item, $.cue_setting_value),
        )
      ),
    ),

    cue_timings: $ => seq(
      $.webvtt_timestamp,
      choice(
        repeat1($._space_separator),
        repeat1($._tab_separator)
      ),
      $.timestamp_arrow,
      choice(
        repeat1($._space_separator),
        repeat1($._tab_separator)
      ),
      $.webvtt_timestamp,
    ),

    webvtt_percentage: $ => seq(
      $.percentage_value,
      $.percentage_symbol
    ),

    webvtt_percentage_pair: $ => seq(
      $.webvtt_percentage,
      $.comma_symbol,
      $.webvtt_percentage,
    ),

    byte_order_mark: () => /\uEFBBBF|\uFEFF|\uFFFE/,

    webvtt_keyword: () => /WEBVTT/,
    region_keyword: () => /REGION/,
    style_keyword: () => /STYLE/,
    note_keyword: () => /NOTE/,

    // REGION component attributes
    id_attribute: () => /id/,
    width_attribute: () => /width/,
    lines_attribute: () => /lines/,
    region_anchor_attribute: () => /regionanchor/,
    viewport_anchor_attribute: () => /viewportanchor/,
    scroll_attribute: () => /scroll/,

    ascii_digits: () => /[0-9]+/,
    _hidden_ascii_digits: $ => alias($.ascii_digits, "hidden_ascii_digits"),

    percentage_value: $ => seq(
      $._hidden_ascii_digits,
      optional(seq(/\./, $._hidden_ascii_digits)),
    ),
    percentage_symbol: () => /%/,

    comma_symbol: () => /,/,

    cue_setting_item: () => /[^ \t:\n\r]+/,

    separator_colon: () => /:/,
    _tab_separator: () => /\t/,
    _space_separator: () => / /,
    _tabs_or_spaces: () => /[ \t]+/,

    _line_terminator: () => /\n|\r|\r\n/,

    // According to the W3C WebVTT spec, the hours in the timestamp should consist of 2 or more ASCII digits.
    // But, it seems Tree-sitter has a bug and doen't support interval quantifier where the upperbound is omitted.
    //
    // As a workaround, I've set the upperbound at a large value like 9.
    webvtt_timestamp: () => /([0-9]{2,9}:)?[0-5][0-9]:[0-5][0-9]\.[0-9]{3}/,
    timestamp_arrow: () => /-->/,
  }
});
