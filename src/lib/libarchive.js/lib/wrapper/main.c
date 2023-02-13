#define LIBARCHIVE_STATIC
//#include "emscripten.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <archive.h>
#include <archive_entry.h>
#define EMSCRIPTEN_KEEPALIVE 

EMSCRIPTEN_KEEPALIVE
const char * get_version(){
  return archive_version_string();
}

EMSCRIPTEN_KEEPALIVE
void* archive_open( const void *buf, size_t size, const char * passphrase ){
  struct archive *a;
  int r;

  a = archive_read_new();
  archive_read_support_filter_all(a);
  archive_read_support_format_all(a);

  if( passphrase ){
    archive_read_add_passphrase(a, passphrase);
  }
  
  r = archive_read_open_memory(a, buf, size);
  if (r != ARCHIVE_OK){
    fprintf(stderr, "Memory read error %d\n",r);
    fprintf(stderr, "%s\n",archive_error_string(a));
  }
  return a;
}

EMSCRIPTEN_KEEPALIVE
const void* get_next_entry(void *archive){
  struct archive_entry *entry;
  if( archive_read_next_header(archive,&entry) == ARCHIVE_OK ){
    return entry;
  }else{
    return NULL;
  }
}

EMSCRIPTEN_KEEPALIVE
void* get_filedata(void *archive,size_t buffsize){
  void *buff = malloc( buffsize );
  int read_size = archive_read_data(archive,buff,buffsize);
  if( read_size < 0 ){
    fprintf(stderr, "Error occured while reading file");
    return (void*) read_size;
  }else{
    return buff;
  }
}

EMSCRIPTEN_KEEPALIVE
void archive_close( void *archive ){
  int r = archive_read_free(archive);
  if (r != ARCHIVE_OK){
    fprintf(stderr, "Error read free %d\n",r);
    fprintf(stderr, "%s\n",archive_error_string(archive));
  }
}
/*
#define MAXBUFLEN 1000000

EMSCRIPTEN_KEEPALIVE
int main(){
  char source[MAXBUFLEN + 1];
  FILE *fp = fopen("addon.zip", "r");
  if (fp != NULL) {
    size_t newLen = fread(source, sizeof(char), MAXBUFLEN, fp);
    if ( ferror( fp ) != 0 ) {
      printf("Error reading file");
    } else {
      source[newLen++] = '\0';       
      void* arch = archive_open(source,newLen);
      printf("arch: %d",arch);
      void* entry = get_next_entry(arch);
      size_t fsize = archive_entry_size(entry);
      void* file = get_filedata(arch,fsize);
      printf("file: %d",file);
    }
    fclose(fp);
  }
}*/

/*
EMSCRIPTEN_KEEPALIVE
char* list_files( const void * buf, size_t size ){

  printf("list_files start\n");
  struct archive *a;
  struct archive_entry *entry;
  int r;
  char* fname = NULL;
  const char* tmp;
  printf("variables initialized\n");
  a = archive_read_new();
  archive_read_support_filter_all(a);
  archive_read_support_format_all(a);
  printf("libarchive initialized\n");
  r = archive_read_open_memory(a, buf, size);
  if (r != ARCHIVE_OK){
    printf("Memory read error %d\n",r);
    printf("%s\n",archive_error_string(a));
    exit(1);
  }
  printf("start read\n");
  while (archive_read_next_header(a, &entry) == ARCHIVE_OK) {
    tmp = archive_entry_pathname(entry);
    free(fname);
    fname = malloc(strlen(tmp));
    strcpy(fname,tmp);
    archive_read_data_skip(a);
  }
  printf("finish read\n");
  r = archive_read_free(a);
  if (r != ARCHIVE_OK){
    printf("Error read free %d\n",r);
    printf("%s\n",archive_error_string(a));
    exit(1);
  }
  return fname;
}
*/
