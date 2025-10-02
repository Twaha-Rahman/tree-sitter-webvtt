(webvtt_block) @keyword

(region_definition_block) @keyword

(region_identifier) @function.built-in
(region_width) @function.built-in
(region_lines) @function.built-in
(region_anchor) @function.built-in
(region_viewport_anchor) @function.built-in
(region_scroll) @function.built-in

(comment_block) @keyword

(cue_name) @keyword
(cue_setting) @function.built-in

(separator_colon) @punctuation.delimiter
(comma_symbol) @punctuation.delimiter

(id_attribute) @property
(width_attribute) @property
(lines_attribute) @property
(region_anchor_attribute) @property
(viewport_anchor_attribute) @property
(scroll_attribute) @property

(ascii_digits_with_terminator) @number
(percentage_symbol) @string

; Only highlight the first few line_with_terminator in style blocks
(style_block
  (style_keyword) @keyword)

;; highlight timestamps as numbers
(webvtt_timestamp) @number
(cue_timings) @keyword

;; highlight cue content as a string
(text_including_terminator) @string
(text_before_terminator) @string

