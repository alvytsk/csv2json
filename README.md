
## Generate csv file

generate_csv has two optional parameters 
- rows count in csv file (default value is 15)
- output filename (when is not set then output goes to stdout)

`node generate_csv 20 output/test1.csv`

For a big csv file first parameter should be about 20000000 (result file will be about 1,3Gb)

## Convert csv to JSON 

For that step the 'scramjet' library is used.

csv2json has two optional parameters
- input csv file (default output/test.csv)
- output json file (default output/test.json)

It will: 
- open read stream
- get chunk from csv data
- remove first 4 elements
- convert to JSON
- save to write stream 

`node csv2json output/test1.csv output/test.json`