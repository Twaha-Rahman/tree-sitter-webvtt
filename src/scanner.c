#include "tree_sitter/parser.h"
#include <inttypes.h>
#include <stdbool.h>
#include <stdint.h>

#define INITIAL_CHARS_TO_CHECK 6
#define ARROW_STRING_SIZE 3

// For the keywords of the WebVTT blocks
int32_t REGION[] = {'R', 'E', 'G', 'I', 'O', 'N'};
int32_t STYLE[] = {'S', 'T', 'Y', 'L', 'E'};
int32_t NOTE[] = {'N', 'O', 'T', 'E'};

int REGION_SIZE = sizeof(REGION) / sizeof(REGION[0]);
int STYLE_SIZE = sizeof(STYLE) / sizeof(STYLE[0]);
int NOTE_SIZE = sizeof(NOTE) / sizeof(NOTE[0]);

enum TokenType {
  TEXT_INCLUDING_TERMINATOR,
  TEXT_BEFORE_TERMINATOR,
  CUE_NAME,
  ERROR_SENTINEL
};

enum ParseResult { INVALID_TOKEN, VALID_TEXT, VALID_CUE_NAME };

static enum ParseResult scan_line(TSLexer *lexer, bool consume_terminator);

int32_t NEWLINE_CHAR = '\n';
int32_t CARRIAGE_RETRUN_CHAR = '\r';

void *tree_sitter_webvtt_external_scanner_create() { return NULL; }
void tree_sitter_webvtt_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_webvtt_external_scanner_serialize(void *payload,
                                                       char *buffer) {
  return 0;
}
void tree_sitter_webvtt_external_scanner_deserialize(void *payload,
                                                     char *buffer,
                                                     unsigned length) {}

bool tree_sitter_webvtt_external_scanner_scan(void *payload, TSLexer *lexer,
                                              const bool *valid_symbols) {
  // If TS is in error recovery, we want to opt-out of the handling it and let
  // TS handle it itself
  if (valid_symbols[ERROR_SENTINEL]) {
    return false;
  }

  // if we encounter an empty line, we don't want to lex it
  if (lexer->lookahead == NEWLINE_CHAR ||
      lexer->lookahead == CARRIAGE_RETRUN_CHAR) {
    return false;
  }

  // we scan the full line regardless of the TokenType
  // we also consume the line terminator depending on the symbols
  bool should_consume_terminator =
      valid_symbols[TEXT_INCLUDING_TERMINATOR] | valid_symbols[CUE_NAME];
  enum ParseResult resp = scan_line(lexer, should_consume_terminator);

  if (resp == INVALID_TOKEN) {
    return false;
  }

  if (valid_symbols[CUE_NAME] && resp == VALID_CUE_NAME) {
    lexer->result_symbol = CUE_NAME;
    return true;
  }

  if (valid_symbols[TEXT_INCLUDING_TERMINATOR] &&
      (resp == VALID_TEXT || resp == VALID_CUE_NAME)) {
    lexer->result_symbol = TEXT_INCLUDING_TERMINATOR;
    return true;
  }

  if (valid_symbols[TEXT_BEFORE_TERMINATOR] &&
      (resp == VALID_TEXT || resp == VALID_CUE_NAME)) {
    lexer->result_symbol = TEXT_BEFORE_TERMINATOR;
    return true;
  }

  return false;
}

static enum ParseResult scan_line(TSLexer *lexer, bool consume_terminator) {
  int32_t initial_chars[INITIAL_CHARS_TO_CHECK] = {-1, -1, -1, -1, -1, -1};

  uint8_t arrow_chars_matched = 0;
  int32_t c = lexer->lookahead;
  int i = 0;
  while ((c != NEWLINE_CHAR) && (c != CARRIAGE_RETRUN_CHAR)) {
    if (lexer->eof(lexer)) {
      return INVALID_TOKEN;
    }

    if (i < INITIAL_CHARS_TO_CHECK) {
      initial_chars[i] = c;
    }

    if (arrow_chars_matched == 0 || arrow_chars_matched == 1) {
      if (c == '-') {
        arrow_chars_matched++;
      } else {
        arrow_chars_matched = 0;
      }
    }
    if (arrow_chars_matched == 2 && c == '>') {
      arrow_chars_matched++;
    }

    lexer->advance(lexer, false);
    c = lexer->lookahead;
    i++;
  }

  // If we encounter either \r or \n, we want to consume only one char
  // But, if we encounter \r\n, we consume both chars
  if (consume_terminator) {
    if (c == CARRIAGE_RETRUN_CHAR && lexer->lookahead == NEWLINE_CHAR) {
      lexer->advance(lexer, false);
      lexer->advance(lexer, false);
    } else {
      lexer->advance(lexer, false);
    }
  }
  lexer->mark_end(lexer);

  bool is_invalid_cue_name = false;

  int match_count = 0;
  if (i >= REGION_SIZE) {
    for (int j = 0; j < REGION_SIZE; j++) {
      if (initial_chars[j] == REGION[j]) {
        match_count++;
      }
    }

    if (match_count == REGION_SIZE) {
      is_invalid_cue_name = true;
    }
  }

  match_count = 0;
  if (i >= STYLE_SIZE) {
    for (int j = 0; j < STYLE_SIZE; j++) {
      if (initial_chars[j] == STYLE[j]) {
        match_count++;
      }
    }

    if (match_count == STYLE_SIZE) {
      is_invalid_cue_name = true;
    }
  }

  match_count = 0;
  if (i >= NOTE_SIZE) {
    for (int j = 0; j < NOTE_SIZE; j++) {
      if (initial_chars[j] == NOTE[j]) {
        match_count++;
      }
    }

    if (match_count == NOTE_SIZE) {
      is_invalid_cue_name = true;
    }
  }

  if (arrow_chars_matched < ARROW_STRING_SIZE) {
    if (!is_invalid_cue_name) {
      return VALID_CUE_NAME;
    }

    return VALID_TEXT;
  }

  return INVALID_TOKEN;
}
