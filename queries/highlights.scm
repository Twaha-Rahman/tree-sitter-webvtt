(separator_colon) @punctuation.delimiter
(comma_symbol) @punctuation.delimiter

(webvtt_block) @string
(webvtt_keyword) @keyword.type

(region_definition_block) @string
(region_keyword) @keyword.type
(attribute_value) @number

(style_keyword) @keyword.type

(comment_block) @comment

(cue_block) @string
(cue_name) @module
(webvtt_timestamp) @function
(timestamp_arrow) @keyword
(cue_setting_name) @property
(cue_setting_value) @string

(id_attribute) @property
(width_attribute) @property
(lines_attribute) @property
(region_anchor_attribute) @property
(viewport_anchor_attribute) @property
(scroll_attribute) @property

(webvtt_percentage
  (percentage_value) @number
  (percentage_symbol) @character)

