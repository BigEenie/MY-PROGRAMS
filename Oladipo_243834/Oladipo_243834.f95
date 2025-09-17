program triangle
implicit none
real :: i_aa !Second moment of area
real :: A ! Area
real :: b ! Base
real :: h ! Height
integer :: ios


!Open the file input.txt to read the values of b and h
open(unit=1, file="input.txt", iostat=ios, status="old", action="read")
read(1,*) b,h

! Declaration 

i_aa = b*h**3
A = ((b*h)/2)

! Saving the result of i_aa and A into the file output.txt

write(unit=2, fmt="output.txt", iostat=ios, advance='NO') i_aa, A

end program triangle