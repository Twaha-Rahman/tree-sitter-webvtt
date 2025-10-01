#include "tree_sitter/alloc.h"
#include "tree_sitter/array.h"
#include "tree_sitter/parser.h"
#include <inttypes.h>
#include <stdbool.h>
#include <stdint.h>

enum TokenType { LINE_WITHOUT_ARROW, CUE_NAME };

enum Result { INVALID, BOTH_APPLICABLE, ONLY_LINE_WITHOUT_ARROW };

static enum Result parse_line(TSLexer *lexer);

// If we need to allocate/deallocate state, we do it in these functions.
void *tree_sitter_webvtt_external_scanner_create() { return NULL; }
void tree_sitter_webvtt_external_scanner_destroy(void *payload) {}

// If we have state, we should load and save it in these functions.
unsigned tree_sitter_webvtt_external_scanner_serialize(void *payload,
                                                       char *buffer) {
  return 0;
}
void tree_sitter_webvtt_external_scanner_deserialize(void *payload,
                                                     char *buffer,
                                                     unsigned length) {}

// all the scanning is done by this function
bool tree_sitter_webvtt_external_scanner_scan(void *payload, TSLexer *lexer,
                                              const bool *valid_symbols) {

  if (lexer->lookahead == '\n') {
    return false;
  }

  // scan the full line regardless of TokenType
  enum Result resp = parse_line(lexer);

  if (resp == INVALID) {
    lexer->result_symbol = LINE_WITHOUT_ARROW;
    return false;
  }

  if (valid_symbols[LINE_WITHOUT_ARROW] &&
      (resp == BOTH_APPLICABLE || resp == ONLY_LINE_WITHOUT_ARROW)) {
    lexer->result_symbol = LINE_WITHOUT_ARROW;
    return true;
  }
  if (valid_symbols[CUE_NAME] && resp == BOTH_APPLICABLE) {
    lexer->result_symbol = CUE_NAME;
    return true;
  }

  return false;
}

static enum Result parse_line(TSLexer *lexer) {
  // lexer->mark_end(lexer);

  int32_t newline = '\n';
  int32_t carriage_return = '\r';

  int32_t first_chars[6] = {-1, -1, -1, -1, -1, -1};

  uint8_t arrow_chars_matched = 0;
  int32_t c = lexer->lookahead;
  int i = 0;
  while ((c != newline) && (c != carriage_return)) {
    if (lexer->eof(lexer)) {
      return INVALID;
    }

    if (i < 6) {
      first_chars[i] = c;
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
  lexer->advance(lexer, false);
  lexer->mark_end(lexer);

  int32_t REGION[] = {'R', 'E', 'G', 'I', 'O', 'N'};
  int32_t STYLE[] = {'S', 'T', 'Y', 'L', 'E'};
  int32_t NOTE[] = {'N', 'O', 'T', 'E'};

  bool is_invalid_cue_name = false;

  int match_count = 0;
  if (i >= 6) {
    for (int j = 0; j < 6; j++) {
      if (first_chars[j] == REGION[j]) {
        match_count++;
      }
    }

    if (match_count == 6) {
      is_invalid_cue_name = true;
    }
  }

  match_count = 0;
  if (i >= 5) {
    for (int j = 0; j < 5; j++) {
      if (first_chars[j] == STYLE[j]) {
        match_count++;
      }
    }

    if (match_count == 5) {
      is_invalid_cue_name = true;
    }
  }

  match_count = 0;
  if (i >= 4) {
    for (int j = 0; j < 4; j++) {
      if (first_chars[j] == NOTE[j]) {
        match_count++;
      }
    }

    if (match_count == 4) {
      is_invalid_cue_name = true;
    }
  }

  if (arrow_chars_matched < 3) {
    if (is_invalid_cue_name) {
      return ONLY_LINE_WITHOUT_ARROW;
    }

    return BOTH_APPLICABLE;
  }

  return INVALID;
}
