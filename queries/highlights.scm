(webvtt_block) @keyword.control

(region_definition_block) @keyword
(region_setting_component) @function.built-in

(comment_block) @keyword
(style_block) @keyword

(cue_identifier) @keyword
(cue_setting) @function.built-in

(cue_setting (separator_colon) @keyword)


; Only highlight the first few line_with_terminator in style blocks
(style_block
  (line_with_terminator) @constant
  (#set! "priority" 105))

;; highlight timestamps as numbers
(timestamp) @number
(timestamp_range_line) @keyword

;; highlight cue content as a string
(line_with_terminator) @string

;; optional: treat the whole timestamp line as a keyword-like thing
(timestamp_range_line) @keyword

