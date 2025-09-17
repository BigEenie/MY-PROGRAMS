 program grace
implicit none
real :: u !Initial velocity in m/s
real :: v !Final velocity in m/s
real :: s ! Displacement in metres
real :: t !Time in seconds
real :: g ! Acceleration due to gravity
integer :: i

u = 0
g = 9.8 

do i = 0,5
t = real(i)
v = u + g*t
s = u*t + 0.5*g*t**2
print*, v 
print*, '============='
print*, s 
end do
end program grace

