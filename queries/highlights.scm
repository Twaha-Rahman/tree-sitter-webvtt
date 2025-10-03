(separator_colon) @punctuation.delimiter
(comma_symbol) @punctuation.delimiter

(webvtt_keyword) @keyword.type

(region_keyword) @keyword.type
(attribute_value) @string
(region_lines
  (attribute_value) @number)

(style_keyword) @keyword.type

(comment_block) @comment

(cue_name) @module
(webvtt_timestamp) @function
(timestamp_arrow) @keyword
(cue_setting_name) @property
(cue_setting_value) @string
(cue_payload) @string

(id_attribute) @property
(width_attribute) @property
(lines_attribute) @property
(region_anchor_attribute) @property
(viewport_anchor_attribute) @property
(scroll_attribute) @property

(webvtt_percentage
  (percentage_value) @number
  (percentage_symbol) @character)

