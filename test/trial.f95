program conditional
implicit none
real :: score
print*, "please enter your score"
read(*,*) score
if ( score > 40 ) then
print*, "you passed"
else
print*, "failed" 
end if


end program conditional