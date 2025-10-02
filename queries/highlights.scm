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

(separator_colon) @keyword


; Only highlight the first few line_with_terminator in style blocks
(style_block
  (style_keyword) @keyword)

;; highlight timestamps as numbers
(timestamp) @number
(timestamp_range_line) @keyword

;; highlight cue content as a string
(text_including_terminator) @string
(text_before_terminator) @string

;; optional: treat the whole timestamp line as a keyword-like thing
(timestamp_range_line) @keyword

