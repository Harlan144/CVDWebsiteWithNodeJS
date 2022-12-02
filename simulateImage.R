# Simulate Deutan Image
suppressPackageStartupMessages(library(magick))
suppressPackageStartupMessages(library(tidyverse))
suppressPackageStartupMessages(library(colorblindr))

convert_hex_vector_to_image <- function(hex, dimensions) {
  x = col2rgb(hex)
  
  r = matrix(as.raw(x[1,]), nrow=dimensions[2], ncol=dimensions[3])
  g = matrix(as.raw(x[2,]), nrow=dimensions[2], ncol=dimensions[3])
  b = matrix(as.raw(x[3,]), nrow=dimensions[2], ncol=dimensions[3])
  
  y = array(raw(0), dim = dimensions)
  y[1,,] = r
  y[2,,] = g
  y[3,,] = b
  
  image_read(y, density="300x300") %>%
    image_convert(format = "jpeg", colorspace = "RGB") %>%
    return()
}


create_simulated_image = function(in_file_path, out_file_path) {
  # Read in the normal vision image
  img <- image_read(in_file_path)
   
  # The first dimension has RGB codes.
  # The second dimension is the width.
  # The third dimension is the height.
  img_data = NULL
  tryCatch(
    expr = {
        img_data = image_data(img, channels="rgb")[,,]
    },
    error = function(e) {
        img = image_convert(img, colorspace="rgb")
        img_data = image_data(img, channels="rgb")[,,]
    },
    warning = function(w) { }
  )

  # This happens when there is a corrupt image file
  if (is.null(img_data))
      return(NULL)

  # Extract channels
  r = img_data[1,,]
  g = img_data[2,,]
  b = img_data[3,,]
    
  # Create tibble that has hex values and additional information
  img_tbl = tibble(r = as.vector(r), g = as.vector(g), b = as.vector(b)) %>%
    mutate(original_hex = str_c("#", str_to_upper(str_c(r, g, b)))) %>%
    mutate(deut_hex = deutan(original_hex, severity=0.8))
    
  # Save modified versions of images
  deut_hex = pull(img_tbl, deut_hex)
  deut_img = convert_hex_vector_to_image(deut_hex, dim(img_data))
    
  out_dir_path = dirname(out_file_path)
  dir.create(out_dir_path, recursive = TRUE, showWarnings = FALSE)

  image_write(deut_img, out_file_path, quality = 100)
}


args = commandArgs(trailingOnly = TRUE)
in_file_path =  paste0(getwd(), "/uploads/",toString(args[1]),".png")
out_file_path =  paste0(getwd(),"/uploads/",toString(args[1]),".png")
create_simulated_image(in_file_path,out_file_path)
print("R script ran!")